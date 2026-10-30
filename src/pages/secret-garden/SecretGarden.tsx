import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import type { Celebration, InvitationData } from '../../invitations/model'
import { formatDate, formatTime, mapURL, weddingISO } from '../../invitations/model'
import { downloadCalendar } from '../../invitations/calendar'
import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection as Section } from '../../invitations/components/InvitationSection'
import { InvitationMedia } from '../../invitations/components/InvitationMedia'
import { InvitationRsvp } from '../../invitations/components/InvitationRsvp'
import PersonalMusic from '../../invitations/PersonalMusic'
import { wrapCardText } from '../../invitations/cardContentFit'
import { PearlClock } from './PearlClock'
import { useSecretGardenCard, useSecretGardenNames } from './useSecretGardenFit'
import './SecretGarden.css'

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t5.${field}`} label={label || field.replaceAll('.', ' · ')} />
}

function AmbientVideo({ src, poster, className }: { src: string; poster?: string; className: string }) {
  const video = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const element = video.current
    if (!element) return
    element.muted = true
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
  useSecretGardenNames(root, JSON.stringify([d.groom, d.bride, d.textOverrides]), stacked)
  return <div ref={root} role={section === 'opening' ? 'heading' : undefined} aria-level={section === 'opening' ? 1 : undefined} className={`sg-names ${stacked ? 'sg-stacked' : ''}`}>
    <div><Copy as="span" field={`${section}.groom`} label={`Groom · ${section}`} data-sg-name="">{d.groom}</Copy>{family && d.groomFamily.trim() && <Copy as="p" field={`${section}.groomFamily`} className="sg-family">{d.groomFamily}</Copy>}</div>
    <Copy field={`${section}.separator`} className="sg-ampersand">&amp;</Copy>
    <div><Copy as="span" field={`${section}.bride`} label={`Bride · ${section}`} data-sg-name="">{d.bride}</Copy>{family && d.brideFamily.trim() && <Copy as="p" field={`${section}.brideFamily`} className="sg-family">{d.brideFamily}</Copy>}</div>
  </div>
}

function EventCard({ event, eventKey, details: d }: { event: Celebration; eventKey: string; details: InvitationData }) {
  const root = useRef<HTMLDivElement>(null)
  const prefix = `event-${eventKey}`
  useSecretGardenCard(root, JSON.stringify([event, d.textOverrides]))
  return <Section as="article" data-invite-section={prefix} className="sg-event">
    <AmbientVideo className="sg-event-video" src="/templates/secret-garden/assets/celebrations.mov" />
    <div ref={root} className="sg-event-copy">
      <Copy as="p" field={`${prefix}.weekday`} className="sg-eyebrow">{formatDate(event.date, { weekday: 'long' })}</Copy>
      <Copy as="h2" field={`${prefix}.title`}>{wrapCardText(event.title, 18)}</Copy>
      <div className="sg-event-date" aria-label={formatDate(event.date)}><Copy field={`${prefix}.day`}>{event.date.slice(8)}</Copy><Copy field={`${prefix}.month`}>{formatDate(event.date, { month: 'short' }).toUpperCase()}</Copy><Copy field={`${prefix}.year`}>{event.date.slice(0, 4)}</Copy></div>
      {event.time && <Copy as="p" field={`${prefix}.time`}>{formatTime(event.time)}</Copy>}
      <Copy as="h3" field={`${prefix}.venue`}>{wrapCardText(event.venue, 24)}</Copy>
      <Copy as="p" field={`${prefix}.address`}>{wrapCardText(event.address, 32)}</Copy>
      <div className="sg-event-links">{event.map.trim() && <Copy as="a" field={`${prefix}.directions`} href={event.map} target="_blank" rel="noreferrer">Directions ↗</Copy>}<Copy as="button" type="button" field={`${prefix}.calendar`} onClick={() => downloadCalendar(event, d.offset, `${d.groom} & ${d.bride}`)}>Add to calendar</Copy></div>
    </div>
  </Section>
}

export default function SecretGarden({ details: d, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const root = useRef<HTMLElement>(null)
  const heroVideo = useRef<HTMLVideoElement>(null)
  const couple = `${d.groom} & ${d.bride}`
  const wedding = { title: 'Wedding', date: d.date, time: d.time, venue: d.venue, address: d.address, map: d.map }
  const events = d.events.map((event, index) => ({ event, key: event.id || `legacy-${index}` })).sort((a, b) => `${a.event.date}T${a.event.time}`.localeCompare(`${b.event.date}T${b.event.time}`))

  const [opened, setOpened] = useState(false)
  const [namesVisible, setNamesVisible] = useState(false)

  useEffect(() => { const previous = document.title; document.title = `${couple} — Secret Garden`; return () => { document.title = previous } }, [couple])

  // Scroll reveal
  const structure = JSON.stringify([events.map(e => e.key), !!d.dressCode.trim()])
  useEffect(() => {
    if (!root.current || !opened || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const elements = [...root.current.querySelectorAll<HTMLElement>('[data-invite-section]:not(.sg-hero)')]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('sg-visible'); observer.unobserve(entry.target) } })
    }, { threshold: .08 })
    elements.forEach(element => { element.classList.add('sg-reveal'); observer.observe(element) })
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove('sg-reveal')) }
  }, [structure, opened])

  function openInvitation() {
    if (opened) return
    setOpened(true)
    const video = heroVideo.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !video) { setNamesVisible(true); return }
    video.currentTime = 0
    video.play().catch(() => { setNamesVisible(true) })
    window.setTimeout(() => setNamesVisible(true), 4000)
  }

  return <InvitationLayoutProvider layout={d.textOverrides}><main ref={root} className={`secret-garden${opened ? ' sg-opened' : ''}${namesVisible ? ' sg-names-visible' : ''}`} style={opened ? undefined : { overflow: 'hidden', height: '100svh' }}>

    {/* ── Opening Hero ── */}
    <Section data-invite-section="opening" className="sg-hero" onClick={openInvitation}>
      <InvitationMedia kind="video" className="sg-hero-video" ref={heroVideo} src="/templates/secret-garden/assets/hero-video.mp4" poster="/templates/secret-garden/assets/cover.jpg" muted playsInline preload="metadata" onEnded={() => setNamesVisible(true)} onError={() => { if (opened) setNamesVisible(true) }} />
      <div className="sg-hero-copy">
        <Copy as="p" field="opening.caption" className="sg-eyebrow">We're getting married</Copy>
        <Names details={d} section="opening" />
        <Copy as="p" field="opening.date" className="sg-eyebrow">{formatDate(d.date)}</Copy>
      </div>
      <button type="button" className="sg-open-btn" tabIndex={opened ? -1 : 0}>Tap to open</button>
    </Section>

    {opened && <>
      <PersonalMusic src={d.music || '/templates/secret-garden/assets/autumn-wind.mp3'} />

      {/* ── Pearl Clock Countdown ── */}
      <PearlClock weddingDate={weddingISO(d)} />

      {/* ── Lights ── */}
      <InvitationMedia className="sg-intro-lights" src="/templates/secret-garden/assets/lights.webp" alt="" />

      {/* ── Welcome ── */}
      <Section data-invite-section="welcome" className="sg-welcome">
        <Copy as="p" field="welcome.caption" className="sg-eyebrow">Together with our families</Copy>
        <Names details={d} section="welcome" family />
        {d.showCoupleIllustrations !== false && <InvitationMedia className="sg-couple-illustration" src="/templates/secret-garden/assets/couple.webp" alt="Illustrated bride and groom holding hands" />}
      </Section>

      {/* ── Details / Venue ── */}
      <Section data-invite-section="venue" className="sg-details">
        <div className="sg-details-heading">
          <Copy as="h2" field="venue.heading">Details</Copy>
          <Copy as="p" field="venue.caption" className="sg-eyebrow">when &amp; where</Copy>
          {d.message.trim() && <Copy as="p" field="venue.message" className="sg-details-message">{d.message}</Copy>}
        </div>
        <div className="sg-venue-card">
          <InvitationMedia className="sg-venue-frame" src="/templates/secret-garden/assets/ornate-badge-2PyCLI0e.png" alt="" width={1080} height={1080} />
          <div className="sg-venue-copy">
            <Copy as="h3" field="venue.location">Location</Copy>
            <Copy as="p" field="venue.name" className="sg-venue-name">{d.venue}</Copy>
            <Copy as="p" field="venue.address">{d.address}</Copy>
            <Copy as="p" field="venue.date" className="sg-venue-date">{formatDate(d.date)}</Copy>
            {d.time && <p className="sg-venue-time"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>{formatTime(d.time)}</p>}
          </div>
        </div>
        <div className="sg-actions">
          {d.map.trim() && <Copy as="a" field="venue.directions" href={mapURL(d.venue, d.address, d.map)} target="_blank" rel="noreferrer">Google Maps</Copy>}
          <Copy as="button" type="button" field="venue.calendar" onClick={() => downloadCalendar(wedding, d.offset, couple)}>Add to calendar</Copy>
        </div>
      </Section>

      {/* ── Programme ── */}
      <Section data-invite-section="programme" className="sg-programme">
        <InvitationMedia src="/templates/secret-garden/assets/food.webp" alt="" />
        <Copy as="h2" field="programme.heading">The programme</Copy>
      </Section>

      {/* ── Event Cards ── */}
      <div className="sg-events">{events.map(({ event, key }) => <EventCard key={key} event={event} eventKey={key} details={d} />)}</div>

      {/* ── Dress Code ── */}
      {d.dressCode.trim() && <Section data-invite-section="dress" className="sg-dress">
        <Copy as="h2" field="dress.heading">Dress Code</Copy>
        <Copy as="p" field="dress.caption" className="sg-eyebrow">what to wear</Copy>
        {d.showCoupleIllustrations !== false && <InvitationMedia src="/templates/secret-garden/assets/dress-code-new.webp" alt="Wedding attire illustration" />}
        <div className="sg-dress-card"><Copy as="h3" field="dress.text">{d.dressCode}</Copy></div>
      </Section>}

      {/* ── RSVP ── */}
      <InvitationRsvp template={5} couple={couple} target={rsvpTarget} countOnly />

      {/* ── Closing ── */}
      <Section data-invite-section="closing" className="sg-closing">
        <Copy as="h2" field="closing.couple" className="sg-closing-names"><span>{d.groom}</span><i>&</i><span>{d.bride}</span></Copy>
        <Copy as="p" field="closing.date" className="sg-eyebrow">{formatDate(d.date)}</Copy>
        <InvitationMedia className="sg-footer-flowers" src="/templates/secret-garden/assets/footer-flowers.png" alt="An embroidered arrangement of white roses and greenery" />
      </Section>

    </>}
  </main></InvitationLayoutProvider>
}
