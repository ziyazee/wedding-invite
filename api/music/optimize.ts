import { createClient } from '@supabase/supabase-js'
import ffmpegPath from 'ffmpeg-static'
import youtubeDl from 'youtube-dl-exec'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const config = { maxDuration: 120 }

const uploadLimit = 20 * 1024 * 1024
const categories = ['Classic', 'Hindu', 'Muslim'] as const
const ffmpegExecutable = process.env.FFMPEG_PATH || (ffmpegPath && existsSync(ffmpegPath) ? ffmpegPath : 'ffmpeg')
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } })

function isYoutubeVideoUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || !['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be', 'www.youtu.be'].includes(url.hostname.toLowerCase())) return false
    const id = url.hostname.toLowerCase().endsWith('youtu.be') ? url.pathname.split('/').filter(Boolean)[0]
      : url.pathname === '/watch' ? url.searchParams.get('v')
      : url.pathname.match(/^\/(?:shorts|embed|live)\/([^/?]+)/)?.[1]
    return typeof id === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(id)
  } catch { return false }
}

function transcode(input: string, output: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(ffmpegExecutable, [
      '-hide_banner', '-loglevel', 'error', '-nostdin', '-y', '-i', input,
      '-map', '0:a:0', '-vn', '-c:a', 'libmp3lame', '-b:a', '128k', '-ar', '44100', '-ac', '2',
      '-map_metadata', '-1', '-id3v2_version', '3', output,
    ], { stdio: 'ignore' })
    const timeout = setTimeout(() => child.kill('SIGKILL'), 105_000)
    child.once('error', () => { clearTimeout(timeout); reject(new Error('Audio optimization could not start.')) })
    child.once('close', code => {
      clearTimeout(timeout)
      if (code === 0) resolve()
      else reject(new Error('This file could not be decoded as a song. Try an MP3, M4A, WAV, AAC, OGG, FLAC, or WebM audio file.'))
    })
  })
}

async function downloadYoutubeAudio(url: string, directory: string, output: string) {
  const task = youtubeDl.exec(url, {
    noPlaylist: true, noWarnings: true, noProgress: true, quiet: true,
    format: 'bestaudio/best', output, maxFilesize: '50M',
    jsRuntimes: `node:${process.execPath}`, remoteComponents: 'ejs:npm',
  }, { cwd: directory })
  let timedOut = false
  const timeout = setTimeout(() => { timedOut = true; task.kill('SIGKILL') }, 90_000)
  try {
    await task
  } catch (error) {
    if (timedOut) throw new Error('Fetching this YouTube song took too long. Try again or upload the audio file.')
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      throw new Error('YouTube importing is not available in this environment because yt-dlp is missing. Install the server dependencies and restart the optimizer.')
    }
    const detail = error && typeof error === 'object'
      ? ('stderr' in error && typeof error.stderr === 'string' ? error.stderr : error instanceof Error ? error.message : '')
      : ''
    const safeDetail = detail
      .replace(/https?:\/\/\S+/gi, '[link]')
      .replace(/[\u0000-\u001f\u007f]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(-360)
    throw new Error(safeDetail
      ? `YouTube import failed: ${safeDetail}`
      : 'YouTube could not provide this song. Check the link and try again.')
  } finally {
    clearTimeout(timeout)
  }
  const downloadedFile = (await readdir(directory)).find(file => file.startsWith('youtube.'))
  if (!downloadedFile) throw new Error('YouTube audio was fetched but could not be prepared. Retry the optimization.')
  return join(directory, downloadedFile)
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') return reply({ error: 'Method not allowed.' }, 405)
  const authorization = request.headers.get('Authorization') || ''
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return reply({ error: 'Sign in as an administrator.' }, 401)

  const url = process.env.VITE_SUPABASE_URL
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) return reply({ error: 'Music optimization is not configured on the server.' }, 503)

  const caller = createClient(url, anonKey, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false } })
  const { data: { user }, error: authError } = await caller.auth.getUser()
  if (authError || !user) return reply({ error: 'Your session expired. Sign in again.' }, 401)
  if (String(user.app_metadata?.role).toUpperCase() !== 'ADMIN') return reply({ error: 'Administrator access required.' }, 403)

  let body: { id?: unknown; name?: unknown; category?: unknown; youtubeUrl?: unknown }
  try { body = await request.json() } catch { return reply({ error: 'Invalid upload request.' }, 400) }
  const id = body?.id
  const name = typeof body?.name === 'string' ? body.name.trim() : ''
  const category = body?.category
  const youtubeUrl = typeof body?.youtubeUrl === 'string' && body.youtubeUrl.trim() ? body.youtubeUrl.trim() : null
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ||
      !name || name.length > 120 || !categories.includes(category as typeof categories[number]) ||
      (body.youtubeUrl !== undefined && body.youtubeUrl !== null && typeof body.youtubeUrl !== 'string')) {
    return reply({ error: 'Enter a song name and choose a valid category.' }, 400)
  }
  if (youtubeUrl !== null && !isYoutubeVideoUrl(youtubeUrl)) return reply({ error: 'Paste a valid YouTube video link.' }, 400)

  const { data: existing, error: lookupError } = await caller.from('music_tracks')
    .select('id,name,category,storage_path').eq('id', id).maybeSingle()
  if (lookupError) return reply({ error: 'The music library could not be checked. Retry the upload.' }, 503)
  if (existing) {
    if (existing.name !== name || existing.category !== category || existing.storage_path !== `tracks/${id}.mp3`) {
      return reply({ error: 'This upload is already registered with different details.' }, 409)
    }
    await caller.storage.from('invitation-music-incoming').remove([`incoming/${id}`])
    return reply({ id, bitrate: 128, format: 'mp3' })
  }

  const incomingPath = `incoming/${id}`
  const outputPath = `tracks/${id}.mp3`
  let source: Blob | null = null
  if (!youtubeUrl) {
    const { data, error: downloadError } = await caller.storage.from('invitation-music-incoming').download(incomingPath)
    if (downloadError || !data) return reply({ error: 'The staged upload could not be found. Choose the file again.' }, 404)
    if (!data.size || data.size > uploadLimit) return reply({ error: 'Choose an audio file up to 20 MB.' }, 413)
    source = data
  }

  const directory = await mkdtemp(join(tmpdir(), 'invitation-music-'))
  try {
    const { data: files, error: listError } = await caller.storage.from('invitation-music').list('tracks', { search: `${id}.mp3`, limit: 100 })
    if (listError) throw new Error('The optimized song could not be checked. Retry the upload.')
    if (!files?.some(file => file.name === `${id}.mp3`)) {
      const outputFile = join(directory, youtubeUrl ? 'youtube.mp3' : 'optimized.mp3')
      if (youtubeUrl) {
        const youtubeSource = await downloadYoutubeAudio(youtubeUrl, directory, join(directory, 'youtube.%(ext)s'))
        await transcode(youtubeSource, outputFile)
      } else {
        const inputPath = join(directory, 'source-audio')
        await writeFile(inputPath, Buffer.from(await source!.arrayBuffer()))
        await transcode(inputPath, outputFile)
      }
      const optimized = await readFile(outputFile)
      if (!optimized.length || optimized.length > uploadLimit) return reply({ error: 'The optimized song is too large to store. Choose a shorter song.' }, 413)

      const { error: storageError } = await caller.storage.from('invitation-music').upload(outputPath, optimized, {
        contentType: 'audio/mpeg', cacheControl: '31536000', upsert: false,
      })
      if (storageError) {
        // A retry may race with an earlier request that completed the upload.
        const { data: retryFiles } = await caller.storage.from('invitation-music').list('tracks', { search: `${id}.mp3`, limit: 100 })
        if (!retryFiles?.some(file => file.name === `${id}.mp3`)) throw new Error('The optimized song could not be stored. Retry the upload.')
      }
    }
    const { data, error: registerError } = await caller.rpc('register_music_track', {
      p_id: id, p_name: name, p_category: category,
    })
    if (registerError || data?.id !== id) throw new Error(registerError?.message || 'The optimized song could not be confirmed. Retry saving it.')

    // Retain the staged original if any step above fails so the admin can retry.
    if (!youtubeUrl) await caller.storage.from('invitation-music-incoming').remove([incomingPath])
    return reply({ id, bitrate: 128, format: 'mp3' })
  } catch (error) {
    return reply({ error: error instanceof Error ? error.message : 'The song could not be optimized. Retry the upload.' }, 500)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
