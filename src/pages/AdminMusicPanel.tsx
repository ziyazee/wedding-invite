import { useRef, useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { musicCategories, type MusicCategory } from '../invitations/musicCatalog'
import { musicBucket, musicLibraryUpdated, storeExistingMusic, validateMusicFile } from '../invitations/musicLibrary'
import { useMusicLibrary } from '../invitations/useMusicLibrary'
import './AdminMusicPanel.css'

type PendingUpload = { id: string; name: string; category: MusicCategory; filename: string }
const pendingKey = 'shaadi-admin-pending-music-upload'
function readPending(): PendingUpload | null {
  try {
    const item = JSON.parse(sessionStorage.getItem(pendingKey) || 'null') as PendingUpload | null
    return item && /^[0-9a-f-]{36}$/.test(item.id) && typeof item.name === 'string' && item.name.length <= 120
      && musicCategories.includes(item.category) && typeof item.filename === 'string' ? item : null
  } catch { return null }
}

export default function AdminMusicPanel() {
  const { tracks, loading, available, error: libraryError, refresh } = useMusicLibrary()
  const [pending, setPending] = useState<PendingUpload | null>(readPending)
  const [name, setName] = useState(pending?.name || '')
  const [category, setCategory] = useState<MusicCategory>(pending?.category || 'Classic')
  const [file, setFile] = useState<File | null>(null)
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
    if (!pending && (!name.trim() || !file)) { setError('Enter a song name and choose an MP3 file.'); return }
    submitting.current = true
    setBusy(true); setError(''); setNotice('')
    let upload = pending
    try {
      if (!upload) {
        setProgress('Checking MP3…')
        await validateMusicFile(file!)
        const next = { id: crypto.randomUUID(), name: name.trim(), category, filename: file!.name }
        setProgress('Uploading MP3…')
        const { error: uploadError } = await supabase.storage.from(musicBucket).upload(`tracks/${next.id}.mp3`, file!, {
          contentType: 'audio/mpeg', cacheControl: '31536000', upsert: false,
        })
        if (uploadError) throw uploadError
        upload = next
        setPending(next)
        // Preserve a completed upload if registration fails or the page reloads.
        try { sessionStorage.setItem(pendingKey, JSON.stringify(next)) } catch { /* Retry remains available in this view. */ }
      }
      setProgress('Saving song…')
      const { data, error: saveError } = await supabase.rpc('register_music_track', { p_id: upload.id, p_name: upload.name, p_category: upload.category })
      if (saveError) throw saveError
      if (data?.id !== upload.id) throw new Error('The song could not be confirmed. Retry saving it.')
      try { sessionStorage.removeItem(pendingKey) } catch { /* Registration is idempotent if this draft reappears. */ }
      setPending(null); setName(''); setFile(null)
      if (fileInput.current) fileInput.current.value = ''
      setNotice(`${upload.name} was added to ${upload.category}.`)
      window.dispatchEvent(new Event(musicLibraryUpdated))
    } catch (cause) {
      const message = cause && typeof cause === 'object' && 'message' in cause && typeof cause.message === 'string' ? cause.message : 'Unable to add this song. Please try again.'
      setError(upload ? `${message} The MP3 is uploaded; retry saving it below.` : message)
    } finally {
      submitting.current = false
      setBusy(false); setProgress('')
    }
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
        <label>MP3 file<input ref={fileInput} type="file" accept=".mp3,audio/mpeg" required={!pending} onChange={event => { setFile(event.target.files?.[0] || null); setError(''); setNotice('') }}/></label>
        <p className="form-note">MP3 audio, up to 20 MB. Files are stored in Supabase Storage.</p>
      </fieldset>
      {pending && <p className="form-note">{pending.filename} is uploaded. Finish saving its name and category.</p>}
      <div className="admin-music-submit"><button type="submit" className="primary-action" disabled={busy || !available}>{busy ? progress : pending ? 'Retry saving song' : 'Upload song'}</button><span role="status">{busy ? progress : loading && !available ? 'Loading music library…' : ''}</span></div>
    </form>
    <section className="admin-music-library" aria-label="Music catalogue">
      <div className="section-heading"><div><span className="workspace-kicker">AVAILABLE SONGS</span><h2>Music library <small>({tracks.length})</small></h2></div><button type="button" className="text-action" disabled={loading} onClick={refresh}>{loading ? 'Refreshing…' : 'Refresh'}</button></div>
      <div className="admin-music-filters"><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search songs" aria-label="Search songs"/><div className="admin-music-tags" role="group" aria-label="Filter music category">{(['All', ...musicCategories] as const).map(tag => <button type="button" key={tag} aria-pressed={filter === tag} onClick={() => setFilter(tag)}>{tag}</button>)}</div></div>
      <div className="table-wrap" ref={library}><table className="orders-table"><thead><tr><th>Song</th><th>Category</th><th>Listen</th></tr></thead><tbody>{visible.map(track => <tr key={track.src}><td>{track.label}</td><td><span className="admin-music-category">{track.category}</span></td><td><audio controls preload="none" src={track.src} aria-label={`Listen to ${track.label}`} onPlay={event => { const current = event.currentTarget; library.current?.querySelectorAll('audio').forEach(audio => { if (audio !== current) audio.pause() }) }}/></td></tr>)}</tbody></table>{!visible.length && <p className="empty-state">No songs match this category or search.</p>}</div>
    </section>
  </div>
}
