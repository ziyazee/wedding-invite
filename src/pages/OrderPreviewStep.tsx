import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import type { InvitationData } from '../invitations/model'
import MusicPicker from './MusicPicker'
import MusicPlaybackControls from './MusicPlaybackControls'
import EventLocationPicker from './EventLocationPicker'
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
  const [pendingLocations, setPendingLocations] = useState(0)
  const locationPendingChanged = useCallback((pending: boolean) => setPendingLocations(count => count + (pending ? 1 : -1)), [])
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
    <fieldset className="event-locations-section" disabled={busy}>
      <legend>Event locations</legend>
      <p className="form-note event-locations-intro">We’ll find locations from your venue details. Check each suggested map, then search or paste a link if you need to change it.</p>
      {details.events.map((event, index) => <EventLocationPicker key={event.id || index}
        title={event.title || `Event ${index + 1}`} venue={event.venue} address={event.address} value={event.map} disabled={busy}
        onPendingChange={locationPendingChanged}
        onChange={map => index === 0 ? onChange('map', map) : onEventMapChange(index - 1, map)}/>)}
    </fieldset>
    <fieldset disabled={busy}>
      <legend>Personal touches</legend>
      <div className="form-grid"><label>Dress code<input value={details.dressCode} maxLength={600} onChange={event => onChange('dressCode', event.target.value)}/></label></div>
      <label>Welcome message<textarea rows={4} value={details.message} maxLength={2000} onChange={event => onChange('message', event.target.value)}/></label>
      <label>Short note<textarea rows={2} value={details.giftNote} maxLength={600} onChange={event => onChange('giftNote', event.target.value)}/></label>
    </fieldset>
    <div className="form-submit-row">
      <button type="button" className="back-action" disabled={busy || pendingLocations > 0} onClick={onBack}>← Back to review</button>
      <button type="submit" className="primary-action" disabled={busy || pendingLocations > 0}>{busy ? (editing ? 'Updating…' : 'Creating…') : pendingLocations > 0 ? 'Adding location…' : (editing ? 'Update invitation →' : 'Create invitation →')}</button>
    </div>
    <p className="form-note" role="status">{draftStatus}</p>
  </div>
}
