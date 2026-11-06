import { supabase } from '../lib/supabase'
import { musicCategories, type MusicCategory } from './musicCatalog'

export const musicBucket = 'invitation-music'
export const musicUploadLimit = 20 * 1024 * 1024
export const musicLibraryUpdated = 'shaadi-music-library-updated'
export type MusicTrack = { id?: string; label: string; category: MusicCategory; src: string; localPath?: string }
type MusicRow = { id: string; name: string; category: MusicCategory; local_path: string | null; storage_path: string | null }

export async function loadMusicLibrary(): Promise<MusicTrack[]> {
  if (!supabase) throw new Error('Connect Supabase to use the music library.')
  // Page through the catalogue rather than silently hitting the API row limit.
  const rows: MusicRow[] = []
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.from('music_tracks')
      .select('id,name,category,local_path,storage_path').order('name').order('id').range(offset, offset + 499)
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') throw new Error('The music library is not set up yet. Apply the music-library database migration first.')
      throw error
    }
    rows.push(...((data || []) as MusicRow[]))
    if (!data || data.length < 500) break
  }
  return rows.filter(row => musicCategories.includes(row.category) && (row.local_path || row.storage_path)).map(row => ({
    id: row.id, label: row.name, category: row.category,
    localPath: row.local_path || undefined,
    src: row.local_path || supabase!.storage.from(musicBucket).getPublicUrl(row.storage_path!).data.publicUrl,
  }))
}

export async function storeExistingMusic(track: MusicTrack) {
  if (!supabase || !track.id || !track.localPath || !/^\/audios\/[a-z0-9/_-]+\.mp3$/.test(track.localPath)) throw new Error('Choose an existing library song to store.')
  const filename = `${track.id}.mp3`
  const path = `tracks/${filename}`
  const bucket = supabase.storage.from(musicBucket)
  const { data: files, error: lookupError } = await bucket.list('tracks', { search: filename, limit: 100 })
  if (lookupError) throw lookupError
  // A previous attempt may have uploaded successfully before registration failed.
  if (!files?.some(file => file.name === filename)) {
    const response = await fetch(track.localPath)
    if (!response.ok) throw new Error(`Could not read ${track.label}.`)
    const file = new File([await response.blob()], filename, { type: 'audio/mpeg' })
    await validateMusicFile(file)
    const { error: uploadError } = await bucket.upload(path, file, { contentType: 'audio/mpeg', cacheControl: '31536000', upsert: false })
    if (uploadError) throw uploadError
  }
  const { data, error } = await supabase.rpc('store_existing_music_track', { p_id: track.id })
  if (error) throw error
  if (data?.id !== track.id || data?.storage_path !== path) throw new Error('The song upload could not be confirmed. Please retry.')
}

export async function validateMusicFile(file: File) {
  if (!/\.mp3$/i.test(file.name) || !file.size || file.size > musicUploadLimit) throw new Error('Choose an MP3 file up to 20 MB.')
  const header = new Uint8Array(await file.slice(0, 10).arrayBuffer())
  const hasID3 = header[0] === 0x49 && header[1] === 0x44 && header[2] === 0x33
  const hasMpegFrame = header[0] === 0xff && (header[1] & 0xe0) === 0xe0 && (header[1] & 0x06) === 0x02
  if (!hasID3 && !hasMpegFrame) throw new Error('This file is not an MP3. Choose an MP3 audio file.')
  // Verify that the browser can read audio, not just a renamed file extension.
  const url = URL.createObjectURL(file)
  const audio = new Audio()
  try {
    await new Promise<void>((resolve, reject) => {
      const finish = (error?: Error) => {
        window.clearTimeout(timeout)
        audio.onloadedmetadata = null
        audio.onerror = null
        if (error) reject(error); else resolve()
      }
      const timeout = window.setTimeout(() => finish(new Error('Could not read this MP3. Choose the file again.')), 15000)
      audio.onloadedmetadata = () => finish(Number.isFinite(audio.duration) && audio.duration > 0 ? undefined : new Error('Choose a playable MP3 file.'))
      audio.onerror = () => finish(new Error('This file could not be read as audio. Choose a playable MP3.'))
      audio.preload = 'metadata'
      audio.src = url
    })
  } finally {
    audio.removeAttribute('src')
    audio.load()
    URL.revokeObjectURL(url)
  }
}
