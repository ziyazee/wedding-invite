import { useEffect, useId, useRef, useState } from 'react'
import { musicCategories, catalogMusicPath, musicLabel, musicCategoryForDesign } from '../invitations/musicCatalog'
import type { MusicCategory } from '../invitations/musicCatalog'
import { useMusicLibrary } from '../invitations/useMusicLibrary'
import './MusicPicker.css'

export default function MusicPicker({ value, onChange, designCategory, previewInPhone = false, autoPreview = false }: { value: string; onChange: (value: string) => void; designCategory?: string; previewInPhone?: boolean; autoPreview?: boolean }) {
  const songGroup = useId()
  const previewAudio = useRef<HTMLAudioElement>(null)
  const playbackAttempt = useRef(0)
  const [previewError, setPreviewError] = useState('')
  const { tracks: library, error, loading, refresh } = useMusicLibrary()
  const selectedPath = catalogMusicPath(value)
  const selectedTrack = library.find(track => track.src === selectedPath)
  const suggestedCategory = designCategory === undefined ? selectedTrack?.category ?? 'Classic' : musicCategoryForDesign(designCategory)
  const [category, setCategory] = useState<MusicCategory>(suggestedCategory)
  useEffect(() => { setCategory(suggestedCategory) }, [suggestedCategory])
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
  const tracks = library.filter(track => track.category === category)
  const selectionOutsideFilter = !!value && !tracks.some(track => track.src === selectedPath)
  const songChoice = (src: string, label: string, note?: string) => <label key={src} title={note} className={`music-picker-choice${selectedPath === src ? ' is-selected' : ''}`}>
    <input type="radio" name={songGroup} value={src} checked={selectedPath === src} onChange={() => chooseSong(src)} onClick={() => { if ((previewInPhone || autoPreview) && selectedPath === src) chooseSong(src) }}/>
    <svg className="music-picker-song-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 18V5l12-2v13M9 9l12-2"/><ellipse cx="6" cy="18" rx="3" ry="3"/><ellipse cx="18" cy="16" rx="3" ry="3"/></svg>
    <span>{label}</span>
  </label>

  return <div className="music-picker">
    <div className="music-picker-tags" role="group" aria-label="Music categories">
      {musicCategories.map(tag => <button type="button" key={tag} aria-pressed={category === tag} onClick={() => setCategory(tag)}>{tag}</button>)}
    </div>
    <div className="music-picker-choices" role="radiogroup" aria-label="Invitation song">
      {songChoice('', 'Template default')}
      {tracks.map(track => songChoice(track.src, track.label))}
      {!tracks.length && <p className="music-picker-empty" role="status">No {category.toLowerCase()} songs yet. Choose another tag or use the template default.</p>}
      {selectionOutsideFilter && songChoice(selectedPath, selectedTrack?.label || musicLabel(value), 'Current selection · kept when you change tags')}
    </div>
    {error && <p className="form-note" role="status">New songs could not be loaded. Your available songs are still here. <button type="button" className="text-action" disabled={loading} onClick={refresh}>Retry</button></p>}
    {previewInPhone ? <p className="form-note">Choose a song to open the phone preview and play it.</p> : autoPreview ? <>
      <audio ref={previewAudio} controls preload="none" hidden={!selectedPath} aria-label={`Preview ${selectedTrack?.label || musicLabel(value)}`} onPlaying={() => setPreviewError('')} style={{ width: '100%', marginTop: 12 }}/>
      {!selectedPath && <p className="form-note">Template default uses your design’s original music.</p>}
      {previewError && <p className="form-note" role="status">{previewError}</p>}
    </> : value && <audio key={selectedPath} controls preload="none" src={selectedPath} aria-label={`Preview ${selectedTrack?.label || musicLabel(value)}`} style={{ width: '100%', marginTop: 12 }}/>}
  </div>
}
