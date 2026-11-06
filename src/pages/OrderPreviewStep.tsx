import { useEffect, useRef, type RefObject } from 'react'
import type { InvitationData } from '../invitations/model'
import MusicPicker from './MusicPicker'
import MusicPlaybackControls from './MusicPlaybackControls'
import './OrderPreviewStep.css'

type PersonalField = 'dressCode' | 'message' | 'giftNote' | 'map' | 'music' | 'musicStart' | 'musicEnd'
type Props = {
  details: InvitationData
  previewFrame: RefObject<HTMLIFrameElement | null>
  designCategory: string
  busy: boolean
  editing: boolean
  draftStatus: string
  onChange: (field: PersonalField, value: string | number | undefined) => void
  onEventMapChange: (index: number, value: string) => void
  onBack: () => void
}

// This is the extra form page; the dashboard shell and phone stay mounted.
export default function OrderPreviewStep({ details, previewFrame, designCategory, busy, editing, draftStatus, onChange, onEventMapChange, onBack }: Props) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => { heading.current?.focus() }, [])

  return <div className="order-personal-step">
    <div className="form-heading"><div>
      <span className="workspace-kicker">THE FINAL DETAILS</span>
      <h2 ref={heading} tabIndex={-1}>Personal touches</h2>
      <p className="form-note">Add the finishing details and preview your invitation.</p>
    </div></div>
    <fieldset disabled={busy}>
      <legend>Music</legend>
      <MusicPicker value={details.music} designCategory={designCategory} previewInPhone onChange={value => onChange('music', value)}/>
      <MusicPlaybackControls value={details.music} start={details.musicStart} end={details.musicEnd} previewFrame={previewFrame} onRangeChange={(start, end) => { onChange('musicStart', start); onChange('musicEnd', end) }} onPlay={() => onChange('music', details.music)}/>
    </fieldset>
    <fieldset disabled={busy}>
      <legend>Event locations</legend>
      <p className="form-note">Add a Google Maps link for each event.</p>
      {details.events.map((event, index) => <label className="order-personal-event-map" key={event.id || index}>
        <span>{event.title || `Event ${index + 1}`}</span>
        <small>{[event.venue, event.address].filter(Boolean).join(', ')}</small>
        <input type="url" inputMode="url" value={event.map} maxLength={2000} placeholder="https://maps.app.goo.gl/…" aria-label={`Google Maps link for ${event.title || `event ${index + 1}`}`} onChange={change => index === 0 ? onChange('map', change.target.value) : onEventMapChange(index - 1, change.target.value)}/>
      </label>)}
    </fieldset>
    <fieldset disabled={busy}>
      <legend>Personal touches</legend>
      <div className="form-grid"><label>Dress code<input value={details.dressCode} maxLength={600} onChange={event => onChange('dressCode', event.target.value)}/></label></div>
      <label>Welcome message<textarea rows={4} value={details.message} maxLength={2000} onChange={event => onChange('message', event.target.value)}/></label>
      <label>Short note<textarea rows={2} value={details.giftNote} maxLength={600} onChange={event => onChange('giftNote', event.target.value)}/></label>
    </fieldset>
    <div className="form-submit-row">
      <button type="button" className="back-action" disabled={busy} onClick={onBack}>← Back to review</button>
      <button type="submit" className="primary-action" disabled={busy}>{busy ? (editing ? 'Updating…' : 'Creating…') : (editing ? 'Update invitation →' : 'Create invitation →')}</button>
    </div>
    <p className="form-note" role="status">{draftStatus}</p>
  </div>
}
