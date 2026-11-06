import { useEffect, useId, useState } from 'react'
import { musicCategories, catalogMusicPath, musicLabel, musicCategoryForDesign } from '../invitations/musicCatalog'
import type { MusicCategory } from '../invitations/musicCatalog'
import { useMusicLibrary } from '../invitations/useMusicLibrary'
import './MusicPicker.css'

export default function MusicPicker({ value, onChange, designCategory, previewInPhone = false }: { value: string; onChange: (value: string) => void; designCategory?: string; previewInPhone?: boolean }) {
  const songGroup = useId()
  const { tracks: library, error, loading, refresh } = useMusicLibrary()
  const selectedPath = catalogMusicPath(value)
  const selectedTrack = library.find(track => track.src === selectedPath)
  const suggestedCategory = designCategory === undefined ? selectedTrack?.category ?? 'Classic' : musicCategoryForDesign(designCategory)
  const [category, setCategory] = useState<MusicCategory>(suggestedCategory)
  useEffect(() => { setCategory(suggestedCategory) }, [suggestedCategory])
  const tracks = library.filter(track => track.category === category)
  const selectionOutsideFilter = !!value && !tracks.some(track => track.src === selectedPath)
  const songChoice = (src: string, label: string, note?: string) => <label key={src} title={note} className={`music-picker-choice${selectedPath === src ? ' is-selected' : ''}`}>
    <input type="radio" name={songGroup} value={src} checked={selectedPath === src} onChange={() => onChange(src)} onClick={() => { if (previewInPhone && selectedPath === src) onChange(src) }}/>
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
    {previewInPhone ? <p className="form-note">Choose a song to open the phone preview and play it.</p> : value && <audio key={selectedPath} controls preload="none" src={selectedPath} aria-label={`Preview ${selectedTrack?.label || musicLabel(value)}`} style={{ width: '100%', marginTop: 12 }}/>}
  </div>
}
