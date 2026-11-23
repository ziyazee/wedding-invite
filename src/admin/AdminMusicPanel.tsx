import { useRef, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { musicCategories, type MusicCategory } from '../invitations/musicCatalog'
import { musicIncomingBucket, musicLibraryUpdated, storeExistingMusic, validateMusicFile } from '../invitations/musicLibrary'
import { useMusicLibrary } from '../invitations/useMusicLibrary'
import './styles/AdminMusicPanel.css'

type PendingUpload = { id: string; name: string; category: MusicCategory; filename: string; youtubeUrl?: string }
const pendingKey = 'shaadi-admin-pending-music-upload'
function readPending(): PendingUpload | null {
  try {
    const item = JSON.parse(sessionStorage.getItem(pendingKey) || 'null') as PendingUpload | null
    return item && /^[0-9a-f-]{36}$/.test(item.id) && typeof item.name === 'string' && item.name.length <= 120
      && musicCategories.includes(item.category) && typeof item.filename === 'string'
      && (item.youtubeUrl === undefined || typeof item.youtubeUrl === 'string') ? item : null
  } catch { return null }
}

export default function AdminMusicPanel() {
  const { tracks, loading, available, error: libraryError, refresh } = useMusicLibrary(undefined, true)
  const [pending, setPending] = useState<PendingUpload | null>(readPending)
  const [name, setName] = useState(pending?.name || '')
  const [category, setCategory] = useState<MusicCategory>(pending?.category || 'Classic')
  const [file, setFile] = useState<File | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState(pending?.youtubeUrl || '')
  const [filter, setFilter] = useState<MusicCategory | 'All'>('All')
  const [search, setSearch] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const submitting = useRef(false)
  const fileInput = useRef<HTMLInputElement>(null)
  const library = useRef<HTMLDivElement>(null)
  const visible = tracks.filter(track => (filter === 'All' || track.category === filter) && track.label.toLowerCase().includes(search.trim().toLowerCase()))
  const localTracks = tracks.filter(track => track.id && track.localPath)

  async function storeExistingSongs() {
    if (submitting.current || !available || pending) return
    submitting.current = true
    setBusy(true); setError(''); setNotice('')
    let completed = 0
    let currentName = ''
    try {
      for (const track of localTracks) {
        currentName = track.label
        setProgress(`Storing ${completed + 1} of ${localTracks.length}: ${track.label}…`)
        await storeExistingMusic(track)
        completed += 1
      }
      setNotice(`${completed} existing ${completed === 1 ? 'song is' : 'songs are'} now stored in Supabase.`)
    } catch (cause) {
      const message = cause && typeof cause === 'object' && 'message' in cause && typeof cause.message === 'string' ? cause.message : 'Please try again.'
      setError(`${currentName} could not be stored. ${message} ${completed} songs completed; retry to continue.`)
    } finally {
      submitting.current = false
      setBusy(false); setProgress('')
      window.dispatchEvent(new Event(musicLibraryUpdated))
    }
  }

  async function saveSong(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (submitting.current || !supabase || !available) return
    if (!pending && (!name.trim() || (!!file === !!youtubeUrl.trim()))) { setError('Enter a song name and choose either an audio file or a YouTube link.'); return }
    submitting.current = true
    setBusy(true); setError(''); setNotice('')
    let upload = pending
    try {
      if (!upload) {
        if (file) {
          setProgress('Checking audio…')
          await validateMusicFile(file)
        }
        const next: PendingUpload = {
          id: crypto.randomUUID(), name: name.trim(), category,
          filename: file?.name || 'YouTube link', ...(youtubeUrl.trim() ? { youtubeUrl: youtubeUrl.trim() } : {}),
        }
        if (file) {
          setProgress('Uploading original…')
          const { error: uploadError } = await supabase.storage.from(musicIncomingBucket).upload(`incoming/${next.id}`, file, {
            contentType: file.type || 'application/octet-stream', cacheControl: 'no-store', upsert: false,
          })
          if (uploadError) throw uploadError
        }
        upload = next
        setPending(next)
        // Preserve the source and its metadata if optimization fails or the page reloads.
        try { sessionStorage.setItem(pendingKey, JSON.stringify(next)) } catch { /* Retry remains available in this view. */ }
      }
      setProgress('Optimizing to 128 kbps…')
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session?.access_token) throw new Error('Sign in again before uploading music.')
      const response = await fetch('/api/music/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session.access_token}` },
        body: JSON.stringify({ id: upload.id, name: upload.name, category: upload.category, ...(upload.youtubeUrl ? { youtubeUrl: upload.youtubeUrl } : {}) }),
      })
      const result = await response.json().catch(() => null) as { id?: string; error?: string } | null
      if (!response.ok) throw new Error(result?.error || `The optimizer returned HTTP ${response.status}. Check the Vercel function logs.`)
      if (result?.id !== upload.id) throw new Error('The optimized song could not be confirmed. Retry saving it.')
      try { sessionStorage.removeItem(pendingKey) } catch { /* Registration is idempotent if this draft reappears. */ }
      setPending(null); setName(''); setFile(null); setYoutubeUrl('')
      if (fileInput.current) fileInput.current.value = ''
      setNotice(`${upload.name} was added to ${upload.category}.`)
      window.dispatchEvent(new Event(musicLibraryUpdated))
    } catch (cause) {
      const message = cause && typeof cause === 'object' && 'message' in cause && typeof cause.message === 'string' ? cause.message : 'Unable to add this song. Please try again.'
      setError(upload ? `${message} Retry the optimization below.` : message)
    } finally {
      submitting.current = false
      setBusy(false); setProgress('')
    }
  }

  async function cancelPendingUpload() {
    if (!pending || submitting.current) return
    submitting.current = true
    setBusy(true); setError(''); setNotice('')
    let cleanupFailed = false
    try {
      if (!pending.youtubeUrl && supabase) {
        const { error: cleanupError } = await supabase.storage.from(musicIncomingBucket).remove([`incoming/${pending.id}`])
        cleanupFailed = !!cleanupError
      }
    } catch { cleanupFailed = true }
    try { sessionStorage.removeItem(pendingKey) } catch { /* The in-memory form can still be reset. */ }
    setPending(null); setName(''); setFile(null); setYoutubeUrl('')
    if (fileInput.current) fileInput.current.value = ''
    if (cleanupFailed) setError('The request was canceled, but its private temporary upload could not be removed.')
    submitting.current = false
    setBusy(false)
  }

  return <div className="admin-music">
    <p className="workspace-lede">Add music for invitations and organise it by category.</p>
    {libraryError && <p className="workspace-alert" role="alert">{libraryError} <button className="text-action" type="button" disabled={loading} onClick={refresh}>Retry</button></p>}
    {error && <p className="workspace-alert" role="alert">{error}</p>}
    {notice && <p className="workspace-success" role="status">{notice}</p>}
    {available && localTracks.length > 0 && <section className="admin-music-upload">
      <div><span className="workspace-kicker">EXISTING SONGS</span><h2>Store existing songs in Supabase</h2></div>
      <p className="form-note">{localTracks.length} songs still use website assets. Copy them to Supabase Storage so the library uses their Supabase audio links.</p>
      <div><button type="button" className="secondary-action" disabled={busy || !!pending || loading} onClick={() => void storeExistingSongs()}>Store existing songs in Supabase</button></div>
    </section>}
    <form className="admin-music-upload" onSubmit={event => void saveSong(event)}>
      <div><span className="workspace-kicker">MUSIC LIBRARY</span><h2>Upload a song</h2></div>
      <fieldset disabled={busy || !!pending || !available}>
        <label>Song name<input required maxLength={120} value={name} onChange={event => setName(event.target.value)} placeholder="Name shown in the song picker"/></label>
        <div><span className="admin-music-label">Category</span><div className="admin-music-tags" role="group" aria-label="Song category">{musicCategories.map(tag => <button type="button" key={tag} aria-pressed={category === tag} onClick={() => setCategory(tag)}>{tag}</button>)}</div></div>
        <label>Song file<input ref={fileInput} type="file" accept="audio/*,.mp3,.m4a,.aac,.wav,.ogg,.opus,.flac,.webm,.wma,.aiff" required={!pending && !youtubeUrl.trim()} onChange={event => { setFile(event.target.files?.[0] || null); setError(''); setNotice('') }}/></label>
        <label>YouTube link<input type="url" value={youtubeUrl} onChange={event => { setYoutubeUrl(event.target.value); setError(''); setNotice('') }} placeholder="https://www.youtube.com/watch?v=…"/></label>
        <p className="form-note">Choose an audio file up to 20 MB or paste a YouTube video link. The server stores the song as a 128 kbps MP3.</p>
      </fieldset>
      {pending && <p className="form-note">{pending.filename} is ready. Retry its 128 kbps optimization.</p>}
      <div className="admin-music-submit"><button type="submit" className="primary-action" disabled={busy || !available}>{busy ? progress : pending ? 'Retry optimization' : 'Upload song'}</button>{pending && <button type="button" className="secondary-action" disabled={busy} onClick={() => void cancelPendingUpload()}>Cancel and start over</button>}<span role="status">{busy ? progress : loading && !available ? 'Loading music library…' : ''}</span></div>
    </form>
    <section className="admin-music-library" aria-label="Music catalogue">
      <div className="section-heading"><div><span className="workspace-kicker">AVAILABLE SONGS</span><h2>Music library <small>({tracks.length})</small></h2></div><button type="button" className="text-action" disabled={loading} onClick={refresh}>{loading ? 'Refreshing…' : 'Refresh'}</button></div>
      <div className="admin-music-filters"><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search songs" aria-label="Search songs"/><div className="admin-music-tags" role="group" aria-label="Filter music category">{(['All', ...musicCategories] as const).map(tag => <button type="button" key={tag} aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag}</button>)}</div></div>
      <div className="table-wrap" ref={library}><table className="orders-table"><thead><tr><th>Song</th><th>Category</th><th>Listen</th></tr></thead><tbody>{visible.map(track => <tr key={track.src}><td>{track.label}</td><td><span className="admin-music-category">{track.category}</span></td><td><audio controls preload="none" src={track.src} aria-label={`Listen to ${track.label}`} onPlay={event => { const current = event.currentTarget; library.current?.querySelectorAll('audio').forEach(audio => { if (audio !== current) audio.pause() }) }}/></td></tr>)}</tbody></table>{!visible.length && <p className="empty-state">No songs match this category or search.</p>}</div>
    </section>
  </div>
}
