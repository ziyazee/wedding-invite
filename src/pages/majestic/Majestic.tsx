import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import type { Celebration, InvitationData } from '../../invitations/model'
import { formatDate, formatTime, weddingISO } from '../../invitations/model'
import { downloadCalendar } from '../../invitations/calendar'
import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection as Section } from '../../invitations/components/InvitationSection'
import { InvitationMedia } from '../../invitations/components/InvitationMedia'
import { InvitationRsvp } from '../../invitations/components/InvitationRsvp'
import PersonalMusic from '../../invitations/PersonalMusic'
import { wrapCardText } from '../../invitations/cardContentFit'
import { useMajesticCard, useMajesticNames } from './useMajesticFit'
import './Majestic.css'

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t2.${field}`} label={label || field.replaceAll('.', ' · ')} />
}

function AmbientVideo({ src, poster, className }: { src: string; poster?: string; className: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const element = video.current
    if (!element) return
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    const sync = () => { if (visible && !motion.matches && !document.hidden) void element.play().catch(() => {}); else element.pause() }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync() })
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)
    sync()
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync); element.pause() }
  }, [])
  return failed && poster ? <InvitationMedia className={className} src={poster} priority alt="" /> : <InvitationMedia kind="video" className={className} ref={video} src={src} poster={poster} muted loop playsInline onError={() => setFailed(true)} aria-hidden="true" />
}

function Names({ details: d, section, family = false }: { details: InvitationData; section: string; family?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const stacked = family && !!(d.groomFamily.trim() || d.brideFamily.trim())
  useMajesticNames(root, JSON.stringify([d.groom, d.bride, d.textOverrides]), stacked)
  return <div ref={root} role={section === 'opening' ? 'heading' : undefined} aria-level={section === 'opening' ? 1 : undefined} className={`mj-names ${stacked ? 'mj-stacked' : ''}`}>
    <div><Copy as="span" field={`${section}.groom`} label={`Groom · ${section}`} data-mj-name="">{d.groom}</Copy>{family && d.groomFamily.trim() && <Copy as="p" field={`${section}.groomFamily`} className="mj-family">{d.groomFamily}</Copy>}</div>
    <Copy field={`${section}.separator`} className="mj-ampersand">&amp;</Copy>
    <div><Copy as="span" field={`${section}.bride`} label={`Bride · ${section}`} data-mj-name="">{d.bride}</Copy>{family && d.brideFamily.trim() && <Copy as="p" field={`${section}.brideFamily`} className="mj-family">{d.brideFamily}</Copy>}</div>
  </div>
}

function Countdown({ details }: { details: InvitationData }) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  let remaining = Math.max(0, Math.floor((new Date(weddingISO(details)).getTime() - now) / 1000))
  const values = [86400, 3600, 60, 1].map(unit => { const value = Math.floor(remaining / unit); remaining %= unit; return value })
  return <Section data-invite-section="countdown" className="mj-countdown">
    <Copy as="h2" field="countdown.heading">Countdown</Copy>
    <div className="mj-clock">{values.map((value, i) => <div key={i}><Copy as="strong" field={`countdown.value-${i}`}>{String(value).padStart(2, '0')}</Copy><Copy as="small" field={`countdown.label-${i}`}>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</Copy></div>)}</div>
  </Section>
}

function EventCard({ event, eventKey, details: d }: { event: Celebration; eventKey: string; details: InvitationData }) {
  const root = useRef<HTMLDivElement>(null)
  const prefix = `event-${eventKey}`
  useMajesticCard(root, JSON.stringify([event, d.textOverrides]))
  return <Section as="article" data-invite-section={prefix} className="mj-event">
    <AmbientVideo className="mj-event-video" src="/design6/assets/celebrations.mp4" />
    <div ref={root} className="mj-event-copy">
      <Copy as="p" field={`${prefix}.weekday`} className="mj-eyebrow">{formatDate(event.date, { weekday: 'long' })}</Copy>
      <Copy as="h2" field={`${prefix}.title`}>{wrapCardText(event.title, 18)}</Copy>
      <div className="mj-event-date" aria-label={formatDate(event.date)}><Copy field={`${prefix}.day`}>{event.date.slice(8)}</Copy><Copy field={`${prefix}.month`}>{formatDate(event.date, { month: 'short' }).toUpperCase()}</Copy><Copy field={`${prefix}.year`}>{event.date.slice(0, 4)}</Copy></div>
      <Copy as="p" field={`${prefix}.time`}>{formatTime(event.time)}</Copy>
      <Copy as="h3" field={`${prefix}.venue`}>{wrapCardText(event.venue, 24)}</Copy>
      <Copy as="p" field={`${prefix}.address`}>{wrapCardText(event.address, 32)}</Copy>
      <div className="mj-links">{event.map.trim() && <Copy as="a" field={`${prefix}.directions`} href={event.map} target="_blank" rel="noreferrer">Directions ↗</Copy>}<Copy as="button" type="button" field={`${prefix}.calendar`} onClick={() => downloadCalendar(event, d.offset, `${d.groom} & ${d.bride}`)}>Add to calendar</Copy></div>
    </div>
  </Section>
}

export default function Majestic({ details: d, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const root = useRef<HTMLElement>(null)
  const couple = `${d.groom} & ${d.bride}`
  const wedding = { title: 'Wedding', date: d.date, time: d.time, venue: d.venue, address: d.address, map: d.map }
  // Capture original indexes before sorting so legacy orders retain stable IDs.
  const events = d.events.map((event, index) => ({ event, key: event.id || `legacy-${index}` })).sort((a, b) => `${a.event.date}T${a.event.time}`.localeCompare(`${b.event.date}T${b.event.time}`))
  const structure = JSON.stringify([events.map(event => event.key), !!d.dressCode.trim(), !!d.giftNote.trim(), !!d.gallery.trim()])
  useEffect(() => { const previous = document.title; document.title = `${couple} — Majestic`; return () => { document.title = previous } }, [couple])
  useEffect(() => {
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(window.location.search).has('editor')) return
    const elements = [...root.current.querySelectorAll<HTMLElement>('[data-invite-section]:not(.mj-hero)')]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('mj-visible'); observer.unobserve(entry.target) } })
    }, { threshold: .08 })
    elements.forEach(element => { element.classList.add('mj-reveal'); observer.observe(element) })
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove('mj-reveal')) }
  }, [structure])
  return <InvitationLayoutProvider layout={d.textOverrides}><main ref={root} className="majestic-native">
    <PersonalMusic src={d.music || '/design6/assets/intro-music-CzqJOUtA.mp3'} />
    <Section data-invite-section="opening" className="mj-hero">
      <AmbientVideo src="/design6/assets/hero-bg-l-slFnvE.mp4" poster="/design6/assets/hero-poster-DkA1j00-.jpg" className="mj-hero-video" />
      <div className="mj-hero-copy"><Copy as="p" field="opening.caption" className="mj-eyebrow">We are getting married</Copy><Names details={d} section="opening" /><Copy as="p" field="opening.date" className="mj-eyebrow">{formatDate(d.date)}</Copy></div>
    </Section>
    <Countdown details={d} />
    <InvitationMedia className="mj-intro-lights" src="/design5/assets/lights.png" alt="" />
    <Section data-invite-section="welcome" className="mj-welcome"><Copy as="p" field="welcome.caption" className="mj-eyebrow">Together with our families</Copy><Names details={d} section="welcome" family /><Copy as="p" field="welcome.message">{d.message}</Copy></Section>
    <Section data-invite-section="venue" className="mj-details">
      <Copy as="h2" field="venue.heading">Details</Copy><Copy as="p" field="venue.caption" className="mj-eyebrow">When &amp; where</Copy>
      <div className="mj-venue-card"><InvitationMedia className="mj-venue-frame" src="/design6/assets/ornate-badge-2PyCLI0e.png" alt="" width={1080} height={1080} /><div className="mj-venue-copy"><Copy as="h3" field="venue.location">Location</Copy><Copy as="p" field="venue.name" className="mj-venue-name">{d.venue}</Copy><Copy as="p" field="venue.address">{d.address}</Copy><Copy as="p" field="venue.time">{formatTime(d.time)}</Copy></div></div>
      <div className="mj-actions">{d.map.trim() && <Copy as="a" field="venue.directions" href={d.map} target="_blank" rel="noreferrer">Google Maps</Copy>}<Copy as="button" type="button" field="venue.calendar" onClick={() => downloadCalendar(wedding, d.offset, couple)}>Add to calendar</Copy></div>
    </Section>
    <Section data-invite-section="programme" className="mj-programme"><InvitationMedia src="/design6/assets/food.png" alt="" /><Copy as="h2" field="programme.heading">The programme</Copy></Section>
    <div className="mj-events">{events.map(({ event, key }) => <EventCard key={key} event={event} eventKey={key} details={d} />)}</div>
    {d.dressCode.trim() && <Section data-invite-section="dress" className="mj-dress"><Copy as="h2" field="dress.heading">Dress Code</Copy><Copy as="p" field="dress.caption" className="mj-eyebrow">A few gentle reminders</Copy>{d.showCoupleIllustrations !== false && <InvitationMedia src="/design5/assets/dress-code-new.png" alt="Wedding attire illustration" />}<div className="mj-dress-card"><Copy as="h3" field="dress.text">{d.dressCode}</Copy></div></Section>}
    {(d.giftNote.trim() || d.gallery.trim()) && <Section data-invite-section="notes" className="mj-notes">{d.giftNote.trim() && <><Copy as="h2" field="notes.heading">A little note</Copy><Copy as="p" field="notes.gift">{d.giftNote}</Copy></>}{d.gallery.trim() && <Copy as="a" field="notes.gallery" href={d.gallery} target="_blank" rel="noreferrer">Our photo gallery ↗</Copy>}</Section>}
    <InvitationRsvp template={2} couple={couple} target={rsvpTarget} />
    <Section as="footer" data-invite-section="closing" className="mj-closing"><Names details={d} section="closing" /><Copy as="p" field="closing.date">{formatDate(d.date)}</Copy><InvitationMedia src="/design5/assets/footer-flowers.png" alt="An embroidered arrangement of white roses and greenery" /></Section>
    <Section as="footer" data-invite-section="contact" className="mj-contact"><Copy as="p" field="contact.heading">For invitations</Copy><Copy as="a" field="contact.link" href="https://wa.me/917975948093?text=Hey%20I%20need%20an%20invitation%21" target="_blank" rel="noreferrer">Contact us on WhatsApp</Copy></Section>
  </main></InvitationLayoutProvider>
}
