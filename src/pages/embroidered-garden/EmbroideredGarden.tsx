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
import type { TextLayout } from '../../invitations/textLayout'
import { useEmbroideredGardenNames, useEmbroideredGardenCard, useIntroFit } from './useEmbroideredGardenFit'
import defaultLayout from './defaultLayout'
import './EmbroideredGarden.css'

const ASSETS = '/templates/embroidered-garden/assets/'

function mergeLayouts(base: TextLayout, overrides?: TextLayout): TextLayout {
  if (!overrides) return base
  return { version: 1, elements: { ...base.elements, ...overrides.elements } }
}

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, animation = 'fade-up', ...props }: CopyProps) {
  return <EditableText {...props} animation={animation} textId={`t6.${field}`} label={label || field.replaceAll('.', ' · ')}>{children}</EditableText>
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
  useEmbroideredGardenNames(root, JSON.stringify([d.groom, d.bride, d.textOverrides]), stacked)
  return <div ref={root} className={`eg-names ${stacked ? 'eg-stacked' : ''}`}>
    <div><Copy as="span" field={`${section}.groom`} label={`Groom · ${section}`} data-eg-name="">{d.groom}</Copy>{family && d.groomFamily.trim() && <Copy as="p" field={`${section}.groomFamily`} className="eg-family">{d.groomFamily}</Copy>}</div>
    <Copy field={`${section}.separator`} className="eg-ampersand">&amp;</Copy>
    <div><Copy as="span" field={`${section}.bride`} label={`Bride · ${section}`} data-eg-name="">{d.bride}</Copy>{family && d.brideFamily.trim() && <Copy as="p" field={`${section}.brideFamily`} className="eg-family">{d.brideFamily}</Copy>}</div>
  </div>
}

function Countdown({ details }: { details: InvitationData }) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => { const timer = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer) }, [])
  let remaining = Math.max(0, Math.floor((new Date(weddingISO(details)).getTime() - now) / 1000))
  const days = Math.floor(remaining / 86400); remaining %= 86400
  const hours = Math.floor(remaining / 3600); remaining %= 3600
  const minutes = Math.floor(remaining / 60)
  const values = [days, hours, minutes]
  const labels = ['Days', 'Hours', 'Minutes']
  return <Section data-invite-section="countdown" className="eg-countdown">
    <InvitationMedia className="eg-countdown-bg" src={`${ASSETS}countdown-embroidery-frame-0EWM-os9.webp`} alt="" />
    <div className="eg-countdown-content">
    <Copy as="h2" field="countdown.heading" className="eg-countdown-heading">Countdown</Copy>
    <div className="eg-medallions">{values.map((value, i) => <div key={i} className="eg-medallion">
      <div className="eg-medallion-pearl">
        <InvitationMedia src={`${ASSETS}countdown-pearl-medallion-DJ2mwLBm.webp`} alt="" />
        <Copy as="strong" field={`countdown.value-${i}`}>{String(value).padStart(2, '0')}</Copy>
      </div>
      <Copy as="small" field={`countdown.label-${i}`}>{labels[i]}</Copy>
    </div>)}</div>
    </div>
  </Section>
}

function EventCard({ event, eventKey, details: d, first }: { event: Celebration; eventKey: string; details: InvitationData; first: boolean }) {
  const root = useRef<HTMLDivElement>(null)
  const prefix = `event-${eventKey}`
  useEmbroideredGardenCard(root, JSON.stringify([event, d.textOverrides]))
  const dateParts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts(new Date(`${event.date}T12:00:00Z`))
  const part = (type: Intl.DateTimeFormatPartTypes) => dateParts.find(item => item.type === type)?.value || ''
  return <Section as="article" data-invite-section={prefix} className={`eg-event ${first ? 'eg-event-first' : 'eg-event-secondary'}`} style={first ? { backgroundImage: `url('${ASSETS}ceremony-reception-bg-v2.webp')` } : undefined}>
    {!first && <AmbientVideo className="eg-event-video" src={`${ASSETS}celebration2.mp4`} />}
    <div ref={root} className="eg-event-copy">
      <Copy as="p" field={`${prefix}.weekday`} className="eg-eyebrow">{formatDate(event.date, { weekday: 'long' })}</Copy>
      <Copy as="h2" field={`${prefix}.title`}>{wrapCardText(event.title, 18)}</Copy>
      <div className="eg-event-date" aria-label={formatDate(event.date)}><Copy field={`${prefix}.day`}>{part('day')}</Copy><Copy field={`${prefix}.month`}>{part('month').toUpperCase()}</Copy><Copy field={`${prefix}.year`}>{part('year')}</Copy></div>
      <Copy as="p" field={`${prefix}.time`}>{formatTime(event.time)}</Copy>
      <Copy as="h3" field={`${prefix}.venue`}>{wrapCardText(event.venue, 24)}</Copy>
      <Copy as="p" field={`${prefix}.address`}>{wrapCardText(event.address, 32)}</Copy>
      <div className="eg-links">{event.map.trim() && <Copy as="a" field={`${prefix}.directions`} href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noreferrer">Directions ↗</Copy>}<Copy as="button" type="button" field={`${prefix}.calendar`} onClick={() => downloadCalendar(event, d.offset, `${d.groom} & ${d.bride}`)}>Add to calendar</Copy></div>
    </div>
    {first && <div className="eg-garland-wrap" aria-hidden="true"><InvitationMedia className="eg-garland" src={`${ASSETS}dresscode-hanging-garland-v2.webp`} alt="" /></div>}
  </Section>
}

export default function EmbroideredGarden({ details: d, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const root = useRef<HTMLElement>(null)
  const heroVideo = useRef<HTMLVideoElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const [opened, setOpened] = useState(false)
  const [namesVisible, setNamesVisible] = useState(false)
  const couple = `${d.groom} & ${d.bride}`
  const events = d.events.map((event, index) => ({ event, key: event.id || `legacy-${index}` }))
  const structure = JSON.stringify([events.map(e => e.key), !!d.dressCode.trim(), !!d.giftNote.trim(), !!d.gallery.trim()])

  useIntroFit(introRef, JSON.stringify([d.textOverrides]))

  useEffect(() => { const previous = document.title; document.title = `${couple} — Embroidered Garden`; return () => { document.title = previous } }, [couple])

  // Load Typekit font stylesheets
  useEffect(() => {
    const sheets = [
      '/templates/embroidered-garden/dbv4jbd.css',
      '/templates/embroidered-garden/yyb5qhs.css',
    ]
    const preloads = [
      { href: `${ASSETS}intro-curtains.jpg`, as: 'image' },
      { href: `${ASSETS}embroidered-swans-hero-v2-optimized.webp`, as: 'image' },
    ]
    const links: HTMLLinkElement[] = []
    for (const href of sheets) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
      links.push(link)
    }
    for (const { href, as: asValue } of preloads) {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.setAttribute('as', asValue)
      document.head.appendChild(link)
      links.push(link)
    }
    return () => { links.forEach(link => link.remove()) }
  }, [])

  // Opening animation
  useEffect(() => {
    if (!opened) return
    const video = heroVideo.current
    if (!video) { setNamesVisible(true); return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setNamesVisible(true); return }
    const playPromise = video.play()
    if (playPromise) playPromise.catch(() => setNamesVisible(true))
    const timeout = setTimeout(() => setNamesVisible(true), 22000)
    const onTime = () => { if (video.duration && video.currentTime >= video.duration - 3) setNamesVisible(true) }
    const onEnd = () => setNamesVisible(true)
    video.addEventListener('timeupdate', onTime)
    video.addEventListener('ended', onEnd)
    return () => { clearTimeout(timeout); video.removeEventListener('timeupdate', onTime); video.removeEventListener('ended', onEnd) }
  }, [opened])

  // Scroll reveal
  useEffect(() => {
    if (!root.current || !opened || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    root.current.classList.add('invite-motion-ready')
    const elements = [...root.current.querySelectorAll<HTMLElement>('[data-invite-animation]')]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('invite-motion-visible'); observer.unobserve(entry.target) } })
    }, { threshold: .04 })
    elements.forEach(element => observer.observe(element))
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove('invite-motion-visible')); root.current?.classList.remove('invite-motion-ready') }
  }, [structure, opened])

  const dateParts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).formatToParts(new Date(`${d.date}T12:00:00Z`))
  const part = (type: Intl.DateTimeFormatPartTypes) => dateParts.find(item => item.type === type)?.value || ''

  const layout = mergeLayouts(defaultLayout, d.textOverrides)
  return <InvitationLayoutProvider layout={layout}><main ref={root} className={`eg-native${opened ? ' eg-opened' : ''}`} style={opened ? undefined : { overflow: 'hidden', height: '100svh' }}>
    <PersonalMusic src={d.music || '/audios/general/autumn-wind.mp3'} />

    {/* Opening */}
    <Section data-invite-section="opening" className="eg-hero">
      <InvitationMedia kind="video" className="eg-hero-video" ref={heroVideo} src={`${ASSETS}intro-doors-trimmed.mp4`} poster={`${ASSETS}intro-curtains.jpg`} muted playsInline preload="auto" />
      <div className="eg-hero-copy">
        <div className="eg-opening-names">
          <Copy as="span" field="opening.groom" data-eg-opening-name="" className={namesVisible ? 'eg-name-visible' : ''}>{d.groom}</Copy>
          <Copy as="span" field="opening.separator" data-eg-opening-name="" className={namesVisible ? 'eg-name-visible' : ''}>&amp;</Copy>
          <Copy as="span" field="opening.bride" data-eg-opening-name="" className={namesVisible ? 'eg-name-visible' : ''}>{d.bride}</Copy>
        </div>
        <div className={`eg-opening-date${namesVisible ? ' eg-name-visible' : ''}`} data-eg-opening-name="" aria-label={formatDate(d.date)}>
          <Copy field="opening.day">{part('day')}</Copy>
          <Copy field="opening.month">{part('month').toUpperCase()}</Copy>
          <Copy field="opening.year">{part('year')}</Copy>
        </div>
      </div>
      <div className={`eg-cover${opened ? ' eg-cover-hidden' : ''}`} role="button" tabIndex={0} onClick={() => setOpened(true)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpened(true) } }} aria-hidden={opened}>
        <img src={`${ASSETS}intro-curtains.jpg`} alt="" />
        <span className="eg-cover-text">Tap to open</span>
      </div>
    </Section>

    {/* Introduction (swans hero) */}
    <Section data-invite-section="welcome-intro" className="eg-introduction">
      <InvitationMedia src={`${ASSETS}embroidered-swans-hero-v2-optimized.webp`} priority alt="Embroidered wedding invitation" />
      <div ref={introRef} className="eg-intro-copy">
        <Copy as="p" field="welcome-intro.heading" className="eg-intro-heading">Two souls.{'\n'}One beautiful journey.</Copy>
        <Copy as="p" field="welcome-intro.message" className="eg-fit-intro-content">With the blessings of God and the love of our families, we invite you to celebrate the beginning of our forever.</Copy>
        <Copy as="p" field="welcome-intro.blessing" className="eg-fit-intro-content">Your presence, your prayers, and your love will make our day complete.</Copy>
      </div>
    </Section>

    <Countdown details={d} />

    {/* Welcome */}
    <Section data-invite-section="welcome" className="eg-welcome">
      <Copy as="p" field="welcome.caption" className="eg-eyebrow">Together with our families</Copy>
      <Names details={d} section="welcome" family />
      <Copy as="p" field="welcome.message">{d.message}</Copy>
    </Section>

    {/* Events */}
    <div className="eg-events">{events.map(({ event, key }, index) => <EventCard key={key} event={event} eventKey={key} details={d} first={index === 0} />)}</div>

    {/* Dress code */}
    {d.dressCode.trim() && <Section data-invite-section="dress" className="eg-note">
      <Copy as="h2" field="dress.heading">Dress code</Copy>
      <Copy as="p" field="dress.text">{d.dressCode}</Copy>
      {d.showCoupleIllustrations !== false && <InvitationMedia className="eg-dress-illustration" src={`${ASSETS}dress-code-illustration-v2.webp`} alt="Wedding attire illustration" />}
    </Section>}

    {/* Gift note */}
    {d.giftNote.trim() && <Section data-invite-section="gift" className="eg-note">
      <Copy as="h2" field="gift.heading">A little note</Copy>
      <Copy as="p" field="gift.text">{d.giftNote}</Copy>
    </Section>}

    {/* Gallery */}
    {d.gallery.trim() && <Section data-invite-section="gallery" className="eg-note">
      <Copy as="a" field="gallery.link" href={d.gallery} target="_blank" rel="noreferrer">Our photo gallery ↗</Copy>
    </Section>}

    {/* RSVP */}
    <InvitationRsvp template={6} couple={couple} target={rsvpTarget} formOnly />

    {/* Personal closing note */}
    <Section data-invite-section="closing-native" className="eg-closing-note">
      <Copy field="closing-native.names" className="eg-closing-names"><span>{d.groom}</span><i>&amp;</i><span>{d.bride}</span></Copy>
      <Copy as="p" field="closing-native.date" className="eg-closing-date">{formatDate(d.date)}</Copy>
    </Section>

    {/* Footer with chateau */}
    <footer className="eg-footer">
      <div className="eg-footer-inner">
        <p className="eg-footer-names">{d.groom} <i>&amp;</i> {d.bride}</p>
        <p className="eg-footer-date">{formatDate(d.date)}</p>
      </div>
      <InvitationMedia className="eg-footer-chateau" src={`${ASSETS}footer-chateau.png`} alt="Chateau illustration" />
    </footer>
  </main></InvitationLayoutProvider>
}
