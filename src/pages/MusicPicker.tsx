import { musicCatalog, musicCategories, catalogMusicPath, isCatalogMusic } from '../invitations/musicCatalog'

export default function MusicPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const custom = !!value && !isCatalogMusic(value)
  return <div className="music-picker">
    <label>Invitation song<select value={catalogMusicPath(value)} onChange={event => onChange(event.target.value)}>
      <option value="">Template default</option>
      {musicCategories.map(category => {
        const tracks = musicCatalog.filter(track => track.category === category)
        return <optgroup key={category} label={category}>
          {tracks.length ? tracks.map(track => <option key={track.src} value={track.src}>{track.label}</option>) : <option disabled>No songs categorized yet</option>}
        </optgroup>
      })}
      {custom && <option value={value}>Current custom song</option>}
    </select></label>
    {value && <audio key={value} controls preload="none" src={value} aria-label="Preview selected song" style={{ width: '100%', marginTop: 12 }}/>}
  </div>
}
