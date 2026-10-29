import { useState } from 'react'
import type { FormEvent } from 'react'
import { saveOrderRsvp } from '../rsvp'
import type { RsvpTarget } from '../rsvp'
import { EditableText as Text } from './EditableText'
import { InvitationSection } from './InvitationSection'
import { InvitationMedia } from './InvitationMedia'

/** Native form shared by migrated invitations; only published orders submit. */
export function InvitationRsvp({ template, couple, target, countOnly }: { template: number; couple: string; target?: RsvpTarget; countOnly?: boolean }) {
  const [opened, setOpened] = useState(false)
  const [attendance, setAttendance] = useState<'yes' | 'no'>('yes')
  const [count, setCount] = useState(1)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')
  const id = (field: string) => `t${template}.rsvp.${field}`
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!target || busy) return
    const data = new FormData(event.currentTarget)
    setBusy(true); setStatus('Sending…')
    try {
      await saveOrderRsvp(target, {
        name: String(data.get('fullName') || '').trim(), attendance,
        count: attendance === 'yes' ? count : 0,
        guests: attendance === 'yes' ? Array.from({ length: count - 1 }, (_, i) => String(data.get(`guest-${i}`) || '').trim()) : [],
        message: String(data.get('message') || '').trim(),
      })
      setStatus('Thank you. Your reply has been saved.')
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Please try again.') }
    finally { setBusy(false) }
  }
  return <InvitationSection data-invite-section="rsvp" className="invitation-rsvp">
    <Text as="p" textId={id('caption')} label="RSVP caption" className="mj-eyebrow">The {couple} wedding</Text>
    <Text as="h2" textId={id('heading')} label="RSVP heading">RSVP</Text>
    <Text as="p" textId={id('intro')} label="RSVP introduction" className="mj-eyebrow">Kindly reply</Text>
    {!opened ? <div className="invitation-envelope">
      <button className="invitation-envelope-art" type="button" onClick={() => setOpened(true)} aria-label="Open your RSVP envelope"><InvitationMedia src="/templates/secret-garden/assets/envelope-closed-new.webp" alt="A closed embroidered ivory envelope" /></button>
      <button type="button" onClick={() => setOpened(true)}><Text textId={id('open')} label="Open RSVP label">Open RSVP</Text></button>
    </div> : <form onSubmit={submit}>
      <InvitationMedia className="invitation-envelope-open" src="/templates/secret-garden/assets/envelope-open-new.webp" alt="An open embroidered ivory envelope" />
      <fieldset><legend><Text textId={id('attendance')} label="Attendance question">Will you attend?</Text></legend>
        <label><input type="radio" name="attendance" value="yes" checked={attendance === 'yes'} onChange={() => setAttendance('yes')} /><Text textId={id('yes')} label="Attending label">Yes, I’ll be there</Text></label>
        <label><input type="radio" name="attendance" value="no" checked={attendance === 'no'} onChange={() => setAttendance('no')} /><Text textId={id('no')} label="Not attending label">Sorry, I can’t</Text></label>
      </fieldset>
      <label><Text textId={id('name')} label="Guest name label">Full name</Text><input name="fullName" autoComplete="name" required maxLength={120} /></label>
      {attendance === 'yes' && <><label><Text textId={id('count')} label="Guest count label">Number of guests</Text><input type="number" min={1} max={10} required value={count} onChange={event => setCount(Math.max(1, Math.min(10, Number(event.target.value) || 1)))} /></label>
        {!countOnly && Array.from({ length: count - 1 }, (_, i) => <label key={i}><Text textId={id(`guest-${i}`)} label={`Guest ${i + 2} label`}>Guest {i + 2} name</Text><input name={`guest-${i}`} required maxLength={120} /></label>)}</>}
      <label><Text textId={id('message')} label="RSVP message label">Message (optional)</Text><textarea name="message" rows={4} maxLength={1000} /></label>
      <button type="submit" disabled={!target || busy}><Text textId={id('submit')} label="Send RSVP label">{busy ? 'Sending…' : 'Send RSVP'}</Text></button>
      <p role="status" aria-live="polite">{status || (!target ? 'RSVP is available on the published invitation.' : '')}</p>
    </form>}
    <div className="invitation-rsvp-lights" aria-hidden="true" />
  </InvitationSection>
}
