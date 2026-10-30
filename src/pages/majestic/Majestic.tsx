import { useEffect, useRef, useState } from 'react'
import type { ComponentProps, CSSProperties } from 'react'
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
import type { TextLayout } from '../../invitations/textLayout'
import { useMajesticCard, useMajesticNames } from './useMajesticFit'
import defaultLayout from './defaultLayout'
import './Majestic.css'

function mergeLayouts(base: TextLayout, overrides?: TextLayout): TextLayout {
  if (!overrides) return base
  return { version: 1, elements: { ...base.elements, ...overrides.elements } }
}

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, animation = 'fade-up', animationStagger = 40, animationDelay = 0, ...props }: CopyProps) {
  const text = typeof children === 'string' ? children : undefined
  const animatedChildren = animation === 'letter-rise' && text !== undefined
    ? [...text].map((character, index) => <span className="invite-motion-letter" style={{ '--letter-delay': `${animationDelay + index * animationStagger}ms` } as CSSProperties} key={index}>{character === ' ' ? '\u00a0' : character}</span>)
    : animation === 'stagger-lines' && text !== undefined
      ? text.split('\n').map((line, index) => <span className="invite-motion-line" style={{ '--line-delay': `${animationDelay + index * animationStagger}ms` } as CSSProperties} key={index}>{line || '\u00a0'}</span>)
      : children
  return <EditableText {...props} animation={animation} animationStagger={animationStagger} animationDelay={animationDelay} textId={`t2.${field}`} label={label || field.replaceAll('.', ' · ')} aria-label={animation === 'letter-rise' ? text : undefined}>{animatedChildren}</EditableText>
}

function AmbientVideo({ src, poster, className, paused: forcePaused = false }: { src: string; poster?: string; className: string; paused?: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const element = video.current
    if (!element) return
    element.muted = true
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let visible = true
    const sync = () => { if (!forcePaused && visible && !motion.matches && !document.hidden) void element.play().catch(() => {}); else element.pause() }
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync() })
    observer.observe(element)
    document.addEventListener('visibilitychange', sync)
    motion.addEventListener('change', sync)
    sync()
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); motion.removeEventListener('change', sync); element.pause() }
  }, [forcePaused])
  return failed && poster ? <InvitationMedia className={className} src={poster} priority alt="" /> : <InvitationMedia kind="video" className={className} ref={video} src={src} poster={poster} preload="auto" muted loop playsInline onError={() => setFailed(true)} aria-hidden="true" />
}

function Names({ details: d, section, family = false }: { details: InvitationData; section: string; family?: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const stacked = family && !!(d.groomFamily.trim() || d.brideFamily.trim())
  const separatorLayout = d.textOverrides?.elements[`t2.${section}.separator`] ?? defaultLayout.elements[`t2.${section}.separator`]
  useMajesticNames(root, JSON.stringify([d.groom, d.bride, d.textOverrides]), stacked, section === 'closing' ? 4 : 8, section === 'closing' ? .04 : .01, section === 'closing' || section === 'opening')
  return <div ref={root} role={section === 'opening' ? 'heading' : undefined} aria-level={section === 'opening' ? 1 : undefined} className={`mj-names ${stacked ? 'mj-stacked' : ''}`}>
    <div><Copy as="span" field={`${section}.groom`} label={`Groom · ${section}`} data-mj-name="" animationReplay={section === 'opening'}>{d.groom}</Copy>{family && d.groomFamily.trim() && <Copy as="p" field={`${section}.groomFamily`} className="mj-family">{d.groomFamily}</Copy>}</div>
    <Copy field={`${section}.separator`} className="mj-ampersand" style={separatorLayout?.y !== undefined ? { top: 0 } : undefined}>&amp;</Copy>
    <div><Copy as="span" field={`${section}.bride`} label={`Bride · ${section}`} data-mj-name="" animationReplay={section === 'opening'}>{d.bride}</Copy>{family && d.brideFamily.trim() && <Copy as="p" field={`${section}.brideFamily`} className="mj-family">{d.brideFamily}</Copy>}</div>
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
    <AmbientVideo className="mj-event-video" src="/templates/majestic/assets/celebrations.mp4" />
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
  const [opened, setOpened] = useState(false)
  const couple = `${d.groom} & ${d.bride}`
  const wedding = { title: 'Wedding', date: d.date, time: d.time, venue: d.venue, address: d.address, map: d.map }
  // Capture original indexes before sorting so legacy orders retain stable IDs.
  const events = d.events.map((event, index) => ({ event, key: event.id || `legacy-${index}` })).sort((a, b) => `${a.event.date}T${a.event.time}`.localeCompare(`${b.event.date}T${b.event.time}`))
  const structure = JSON.stringify([events.map(event => event.key), !!d.dressCode.trim(), !!d.giftNote.trim(), !!d.gallery.trim()])
  useEffect(() => { const previous = document.title; document.title = `${couple} — Majestic`; return () => { document.title = previous } }, [couple])
  useEffect(() => {
    const preloads = [
      { href: '/templates/majestic/assets/hero-poster-DkA1j00-.jpg', as: 'image' },
      { href: '/templates/majestic/assets/hero-bg-l-slFnvE.mp4', as: 'video' },
      { href: '/templates/majestic/assets/celebrations.mp4', as: 'video' },
      { href: '/templates/majestic/assets/font-0.woff2', as: 'font', type: 'font/woff2' },
      { href: '/templates/majestic/assets/bodoni-moda-latin-italic-400.woff2', as: 'font', type: 'font/woff2' },
    ]
    const links = preloads.map(({ href, as: asValue, type }) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.setAttribute('as', asValue)
      if (type) link.type = type
      if (asValue === 'font') link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
      return link
    })
    return () => { links.forEach(link => link.remove()) }
  }, [])
  useEffect(() => {
    if (!root.current || !opened || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.current.classList.add('invite-motion-ready')
    const elements = [...root.current.querySelectorAll<HTMLElement>('[data-invite-animation]')]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const element = entry.target
        if (entry.isIntersecting) {
          element.classList.add('invite-motion-visible')
          if (!element.hasAttribute('data-invite-animation-replay')) observer.unobserve(element)
        } else if (element.hasAttribute('data-invite-animation-replay')) element.classList.remove('invite-motion-visible')
      })
    }, { threshold: .12, rootMargin: '0px 0px -4% 0px' })
    elements.forEach(element => observer.observe(element))
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove('invite-motion-visible')); root.current?.classList.remove('invite-motion-ready') }
  }, [structure, opened])
  const layout = mergeLayouts(defaultLayout, d.textOverrides)
  return <InvitationLayoutProvider layout={layout}><main ref={root} className={`majestic-native${opened ? ' mj-opened' : ''}`} style={opened ? undefined : { overflow: 'hidden', height: '100svh' }}>
    <PersonalMusic src={d.music || '/templates/majestic/assets/intro-music-CzqJOUtA.mp3'} />
    <Section data-invite-section="opening" className="mj-hero">
      <AmbientVideo src="/templates/majestic/assets/hero-bg-l-slFnvE.mp4" poster="/templates/majestic/assets/hero-poster-DkA1j00-.jpg" className="mj-hero-video" paused={!opened} />
      <div className="mj-hero-copy"><Copy as="p" field="opening.caption" className="mj-eyebrow" animationReplay>We are getting married</Copy><Names details={d} section="opening" /><Copy as="p" field="opening.date" className="mj-eyebrow" animationReplay>{formatDate(d.date)}</Copy></div>
      {!opened && <div className="mj-cover" onClick={() => setOpened(true)}><button type="button" className="mj-open-btn">Open Invitation</button></div>}
    </Section>
    <Countdown details={d} />
    <InvitationMedia className="mj-intro-lights" src="/templates/majestic/assets/lights.webp" alt="" />
    <Section data-invite-section="welcome" className="mj-welcome"><Copy as="p" field="welcome.caption" className="mj-eyebrow">Together with our families</Copy><Names details={d} section="welcome" family /><Copy as="p" field="welcome.message">{d.message}</Copy></Section>
    <Section data-invite-section="venue" className="mj-details">
      <Copy as="h2" field="venue.heading">Details</Copy><Copy as="p" field="venue.caption" className="mj-eyebrow">When &amp; where</Copy>
      <div className="mj-venue-card"><InvitationMedia className="mj-venue-frame" src="/templates/majestic/assets/ornate-badge-2PyCLI0e.png" alt="" width={1080} height={1080} /><div className="mj-venue-copy"><Copy as="h3" field="venue.location">Location</Copy><Copy as="p" field="venue.name" className="mj-venue-name">{d.venue}</Copy><Copy as="p" field="venue.address">{d.address}</Copy><Copy as="p" field="venue.time">{formatTime(d.time)}</Copy></div></div>
      <div className="mj-actions">{d.map.trim() && <Copy as="a" field="venue.directions" href={d.map} target="_blank" rel="noreferrer">Google Maps</Copy>}<Copy as="button" type="button" field="venue.calendar" onClick={() => downloadCalendar(wedding, d.offset, couple)}>Add to calendar</Copy></div>
    </Section>
    <Section data-invite-section="programme" className="mj-programme"><InvitationMedia src="/templates/majestic/assets/food.webp" alt="" /><Copy as="h2" field="programme.heading">The programme</Copy></Section>
    <div className="mj-events">{events.map(({ event, key }) => <EventCard key={key} event={event} eventKey={key} details={d} />)}</div>
    {d.dressCode.trim() && <Section data-invite-section="dress" className="mj-dress"><Copy as="h2" field="dress.heading">Dress Code</Copy><Copy as="p" field="dress.caption" className="mj-eyebrow">A few gentle reminders</Copy>{d.showCoupleIllustrations !== false && <InvitationMedia src="/templates/majestic/assets/dress-code-new.webp" alt="Wedding attire illustration" />}<div className="mj-dress-card"><Copy as="h3" field="dress.text">{d.dressCode}</Copy></div></Section>}
    {(d.giftNote.trim() || d.gallery.trim()) && <Section data-invite-section="notes" className="mj-notes">{d.giftNote.trim() && <><Copy as="h2" field="notes.heading">A little note</Copy><Copy as="p" field="notes.gift">{d.giftNote}</Copy></>}{d.gallery.trim() && <Copy as="a" field="notes.gallery" href={d.gallery} target="_blank" rel="noreferrer">Our photo gallery ↗</Copy>}</Section>}
    <InvitationRsvp template={2} couple={couple} target={rsvpTarget} envelopeClosed="/templates/majestic/assets/envelope-closed-new.webp" envelopeOpen="/templates/majestic/assets/envelope-open-new.webp" />
    <Section as="footer" data-invite-section="closing" className="mj-closing"><Names details={d} section="closing" /><Copy as="p" field="closing.date">{formatDate(d.date)}</Copy><InvitationMedia src="/templates/majestic/assets/footer-flowers.png" alt="An embroidered arrangement of white roses and greenery" /></Section>
  </main></InvitationLayoutProvider>
}
