import { useEffect, useId, useRef, useState } from 'react'
import { musicCategories, catalogMusicPath, musicLabel, musicCategoryForDesign } from '../invitations/musicCatalog'
import { createCompanyMusicTag, loadCompanyMusicTags, musicLibraryUpdated, uploadCompanyMusic } from '../invitations/musicLibrary'
import { useMusicLibrary } from '../invitations/useMusicLibrary'
import './MusicPicker.css'

export default function MusicPicker({ value, onChange, designCategory, companyId, previewInPhone = false, autoPreview = false }: { value: string; onChange: (value: string) => void; designCategory?: string; companyId?: number; previewInPhone?: boolean; autoPreview?: boolean }) {
  const songGroup = useId()
  const previewAudio = useRef<HTMLAudioElement>(null)
  const playbackAttempt = useRef(0)
  const [previewError, setPreviewError] = useState('')
  const [uploadName, setUploadName] = useState('')
  const [uploadCategory, setUploadCategory] = useState('')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadNotice, setUploadNotice] = useState('')
  const [companyTags, setCompanyTags] = useState<string[]>([])
  const [tagError, setTagError] = useState('')
  const [tagRevision, setTagRevision] = useState(0)
  const [showTagModal, setShowTagModal] = useState(false)
  const [tagName, setTagName] = useState('')
  const [savingTag, setSavingTag] = useState(false)
  const uploadFileRef = useRef<HTMLInputElement>(null)
  const uploadNameRef = useRef<HTMLInputElement>(null)
  const tagNameRef = useRef<HTMLInputElement>(null)
  const { tracks: library, error, loading, refresh } = useMusicLibrary(companyId)
  const selectedPath = catalogMusicPath(value)
  const selectedTrack = library.find(track => track.src === selectedPath)
  const suggestedCategory = designCategory === undefined ? selectedTrack?.category ?? 'Classic' : musicCategoryForDesign(designCategory)
  const [category, setCategory] = useState<string>(suggestedCategory)
  useEffect(() => { setCategory(suggestedCategory) }, [suggestedCategory])
  useEffect(() => {
    if (companyId === undefined) return
    let cancelled = false
    void loadCompanyMusicTags(companyId).then(tags => {
      if (cancelled) return
      setCompanyTags(tags.map(tag => tag.name))
      setTagError('')
    }).catch(cause => {
      if (!cancelled) setTagError(cause instanceof Error ? cause.message : 'Could not load your store tags.')
    })
    return () => { cancelled = true }
  }, [companyId, tagRevision])
  useEffect(() => {
    if (!showUploadModal && !showTagModal) return
    if (showUploadModal) uploadNameRef.current?.focus()
    if (showTagModal) tagNameRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !uploading && !savingTag) {
        setShowUploadModal(false)
        setShowTagModal(false)
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [showUploadModal, showTagModal, uploading, savingTag])
  useEffect(() => {
    const audio = previewAudio.current
    if (!audio) return
    // Keep one player mounted. Reassigning src during React's commit after a
    // tap can interrupt the play() call that carries Safari's user gesture.
    if (selectedPath && audio.src !== new URL(selectedPath, document.baseURI).href) {
      playbackAttempt.current += 1
      audio.pause()
      audio.src = selectedPath
    } else if (!selectedPath && audio.hasAttribute('src')) {
      playbackAttempt.current += 1
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }
  }, [selectedPath, autoPreview, previewInPhone])
  useEffect(() => {
    const audio = previewAudio.current
    return () => { playbackAttempt.current += 1; audio?.pause() }
  }, [autoPreview, previewInPhone])

  function chooseSong(src: string) {
    if (autoPreview && !previewInPhone && previewAudio.current) {
      const audio = previewAudio.current
      const attempt = ++playbackAttempt.current
      setPreviewError('')
      audio.pause()
      if (src) {
        if (audio.src !== new URL(src, document.baseURI).href) audio.src = src
        audio.currentTime = 0
        // Start directly in the tap handler, including repeat taps on a song.
        void audio.play().catch(() => {
          if (attempt === playbackAttempt.current) setPreviewError('Could not start this song. Tap Play to try again.')
        })
      } else {
        audio.removeAttribute('src')
        audio.load()
      }
    }
    onChange(src)
  }
  async function uploadSong() {
    if (!companyId || !uploadFile || !uploadName.trim() || !uploadCategory || uploading) return
    setUploading(true); setUploadError(''); setUploadNotice('')
    try {
      const track = await uploadCompanyMusic(companyId, uploadName, uploadCategory, uploadFile)
      setUploadName(''); setUploadCategory(''); setUploadFile(null)
      if (uploadFileRef.current) uploadFileRef.current.value = ''
      window.dispatchEvent(new Event(musicLibraryUpdated))
      chooseSong(track.src)
      setShowUploadModal(false)
      setUploadNotice(`${track.label} was added to your store.`)
    } catch (cause) {
      setUploadError(cause instanceof Error ? cause.message : 'Could not upload this song. Please try again.')
    } finally { setUploading(false) }
  }
  async function addTag() {
    if (companyId === undefined || !tagName.trim() || savingTag) return
    setSavingTag(true); setTagError('')
    try {
      const tag = await createCompanyMusicTag(companyId, tagName)
      setCompanyTags(current => [...current.filter(name => name.toLowerCase() !== tag.name.toLowerCase()), tag.name].sort((a, b) => a.localeCompare(b)))
      setCategory(tag.name)
      setTagName('')
      setShowTagModal(false)
    } catch (cause) {
      setTagError(cause instanceof Error ? cause.message : 'Could not add this tag. Please try again.')
    } finally { setSavingTag(false) }
  }
  const tracks = library.filter(track => track.category === category)
  const selectionOutsideFilter = !!value && !tracks.some(track => track.src === selectedPath)
  const songChoice = (src: string, label: string, note?: string) => <label key={src} title={note} className={`music-picker-choice${selectedPath === src ? ' is-selected' : ''}`}>
    <input type="radio" name={songGroup} value={src} checked={selectedPath === src} onChange={() => chooseSong(src)} onClick={() => { if ((previewInPhone || autoPreview) && selectedPath === src) chooseSong(src) }}/>
    <svg className="music-picker-song-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13M9 9l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/></svg>
    <span>{label}</span>
  </label>

  return <div className="music-picker">
    <div className="music-picker-tags" role="group" aria-label="Music categories">
      {[...musicCategories, ...companyTags].map(tag => <button type="button" key={tag} aria-pressed={category === tag} onClick={() => setCategory(tag)}>{tag}</button>)}
      {companyId !== undefined && <button type="button" className="music-picker-add-tag" onClick={() => { setTagError(''); setTagName(''); setShowTagModal(true) }}>+ Add tag</button>}
    </div>
    <div className="music-picker-choices" role="radiogroup" aria-label="Invitation song">
      {songChoice('', 'Template default')}
      {tracks.map(track => songChoice(track.src, track.label))}
      {!tracks.length && <p className="music-picker-empty" role="status">No {category.toLowerCase()} songs yet. Choose another tag or use the template default.</p>}
      {selectionOutsideFilter && songChoice(selectedPath, selectedTrack?.label || musicLabel(value), 'Current selection · kept when you change tags')}
    </div>
    {error && <p className="form-note" role="status">New songs could not be loaded: {error} Your available songs are still here. <button type="button" className="text-action" disabled={loading} onClick={refresh}>Retry</button></p>}
    {tagError && !showTagModal && <p className="form-note" role="alert">Store tags could not be loaded. {tagError} <button type="button" className="text-action" onClick={() => setTagRevision(value => value + 1)}>Retry</button></p>}
    {companyId !== undefined && <button type="button" className="music-store-upload-trigger" onClick={() => { setUploadError(''); setUploadNotice(''); setUploadName(''); setUploadCategory(''); setUploadFile(null); setShowUploadModal(true) }}>Upload music</button>}
    {uploadNotice && <p className="music-store-upload-message" role="status">{uploadNotice}</p>}
    {companyId !== undefined && showUploadModal && <div className="music-store-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !uploading) setShowUploadModal(false) }}>
      <section className="music-store-modal" role="dialog" aria-modal="true" aria-labelledby="music-store-modal-title">
        <button type="button" className="music-store-modal-close" disabled={uploading} onClick={() => setShowUploadModal(false)} aria-label="Close">×</button>
        <h3 id="music-store-modal-title">Upload music</h3>
        <p>MP3 up to 20 MB. Choose which tag this song belongs to.</p>
        <label>Song name<input ref={uploadNameRef} value={uploadName} maxLength={120} required onChange={event => setUploadName(event.target.value)} placeholder="Name shown in the song picker"/></label>
        <label>Tag<select value={uploadCategory} onChange={event => setUploadCategory(event.target.value)} required><option value="">Choose a tag</option>{[...musicCategories, ...companyTags].map(tag => <option key={tag} value={tag}>{tag}</option>)}</select></label>
        <label>MP3 file<input ref={uploadFileRef} type="file" accept=".mp3,audio/mpeg" required onChange={event => { setUploadFile(event.target.files?.[0] || null); setUploadError('') }}/></label>
        {uploadError && <p className="music-store-upload-message" role="alert">{uploadError}</p>}
        <div className="music-store-modal-actions"><button type="button" disabled={uploading} onClick={() => setShowUploadModal(false)}>Cancel</button><button type="button" disabled={uploading || !uploadName.trim() || !uploadCategory || !uploadFile} onClick={() => void uploadSong()}>{uploading ? 'Uploading…' : 'Upload song'}</button></div>
      </section>
    </div>}
    {companyId !== undefined && showTagModal && <div className="music-store-modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget && !savingTag) setShowTagModal(false) }}>
      <section className="music-store-modal" role="dialog" aria-modal="true" aria-labelledby="music-store-tag-title">
        <button type="button" className="music-store-modal-close" disabled={savingTag} onClick={() => setShowTagModal(false)} aria-label="Close">×</button>
        <h3 id="music-store-tag-title">Add a store tag</h3>
        <p>This tag will be visible only in your store’s music library.</p>
        <label>Tag name<input ref={tagNameRef} value={tagName} maxLength={40} onChange={event => { setTagName(event.target.value); setTagError('') }} placeholder="e.g. Reception"/></label>
        {tagError && <p className="music-store-upload-message" role="alert">{tagError}</p>}
        <div className="music-store-modal-actions"><button type="button" disabled={savingTag} onClick={() => setShowTagModal(false)}>Cancel</button><button type="button" disabled={savingTag || !tagName.trim()} onClick={() => void addTag()}>{savingTag ? 'Adding…' : 'Add tag'}</button></div>
      </section>
    </div>}
    {previewInPhone ? <p className="form-note">Choose a song to open the phone preview and play it.</p> : autoPreview ? <>
      <audio ref={previewAudio} controls preload="none" hidden={!selectedPath} aria-label={`Preview ${selectedTrack?.label || musicLabel(value)}`} onPlaying={() => setPreviewError('')} style={{ width: '100%', marginTop: 12 }}/>
      {!selectedPath && <p className="form-note">Template default uses your design’s original music.</p>}
      {previewError && <p className="form-note" role="status">{previewError}</p>}
    </> : value && <audio key={selectedPath} controls preload="none" src={selectedPath} aria-label={`Preview ${selectedTrack?.label || musicLabel(value)}`} style={{ width: '100%', marginTop: 12 }}/>}
  </div>
}
