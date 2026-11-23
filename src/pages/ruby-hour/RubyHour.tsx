import { useEffect, useRef, useState, useCallback } from 'react'
import type { ComponentProps } from 'react'
import type { InvitationData } from '../../invitations/model'
import { formatDate, formatTime, mapURL, weddingISO } from '../../invitations/model'
import { downloadCalendar } from '../../invitations/calendar'
import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection as Section } from '../../invitations/components/InvitationSection'
import { InvitationMedia } from '../../invitations/components/InvitationMedia'
import { InvitationRsvp } from '../../invitations/components/InvitationRsvp'
import PersonalMusic from '../../invitations/PersonalMusic'
import { useScrollReveal, useEnvelopeRise, useCalendarFlip, useTimelineProgress, useCountdown } from './useRubyHourEffects'
import './RubyHour.css'

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t19.${field}`} label={label || field.replaceAll('.', ' · ')} />
}

function AmbientVideo({ src, poster, className, onEnded }: { src: string; poster?: string; className?: string; onEnded?: () => void }) {
  const video = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    const el = video.current
    if (!el) return
    el.muted = true
    const tryPlay = () => { void el.play().catch(() => {}) }
    el.addEventListener('canplay', tryPlay, { once: true })
    tryPlay()
    return () => { el.removeEventListener('canplay', tryPlay); el.pause() }
  }, [])
  if (failed && poster) return <InvitationMedia className={className} src={poster} priority alt="" />
  return <InvitationMedia kind="video" className={className} ref={video} src={src} poster={poster} muted playsInline preload="auto" onEnded={onEnded} onError={() => setFailed(true)} aria-hidden="true" />
}

function calendarMonths(weddingDate: string, count: number) {
  const d = new Date(`${weddingDate}T12:00:00Z`)
  const months: { year: number; month: number; monthName: string }[] = []
  for (let i = count - 1; i >= 0; i--) {
    const m = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1))
    months.push({ year: m.getUTCFullYear(), month: m.getUTCMonth(), monthName: m.toLocaleDateString('en-US', { month: 'long', timeZone: 'UTC' }) })
  }
  return months
}

function monthGrid(year: number, month: number) {
  const first = new Date(Date.UTC(year, month, 1))
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  const startDay = first.getUTCDay()
  const cells: (number | null)[] = Array(startDay).fill(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

function isWeekend(year: number, month: number, day: number) {
  const dow = new Date(Date.UTC(year, month, day)).getUTCDay()
  return dow === 0 || dow === 6
}

export default function RubyHour({ details: d, rsvpTarget }: { details: InvitationData; rsvpTarget?: RsvpTarget }) {
  const root = useRef<HTMLElement>(null)
  const letterRef = useRef<HTMLElement>(null)
  const calendarRef = useRef<HTMLElement>(null)
  const timelineRef = useRef<HTMLElement>(null)
  const couple = d.brideFirst ? `${d.bride} & ${d.groom}` : `${d.groom} & ${d.bride}`
  const wedding = { title: 'Wedding', date: d.date, time: d.time, venue: d.venue, address: d.address, map: d.map }
  const weddingDay = parseInt(d.date.slice(8), 10)
  const weddingMonth = parseInt(d.date.slice(5, 7), 10) - 1
  const weddingYear = parseInt(d.date.slice(0, 4), 10)
  const countdown = useCountdown(weddingISO(d))
  const calendarPages = calendarMonths(d.date, 4)

  const [opened, setOpened] = useState(false)
  const [namesPhase, setNamesPhase] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [videoStill, setVideoStill] = useState(false)
  const [activeSwatch, setActiveSwatch] = useState(1)

  useEffect(() => { const prev = document.title; document.title = `${couple} — Ruby Hour`; return () => { document.title = prev } }, [couple])

  useEffect(() => {
    const fonts = [
      '/templates/ruby-hour/assets/fonts/Corinthia-normal-400.woff2',
      '/templates/ruby-hour/assets/fonts/GildaDisplay-normal-400.woff2',
      '/templates/ruby-hour/assets/fonts/CormorantGaramond-normal.woff2',
      '/templates/ruby-hour/assets/fonts/CormorantGaramond-italic.woff2',
      '/templates/ruby-hour/assets/fonts/AlbertSans-normal.woff2',
    ]
    const links = fonts.map(href => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = href
      link.setAttribute('as', 'font')
      link.setAttribute('type', 'font/woff2')
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
      return link
    })
    return () => { links.forEach(l => l.remove()) }
  }, [])

  useScrollReveal(root, opened)
  useEnvelopeRise(letterRef, opened)
  useCalendarFlip(calendarRef, calendarPages.length, opened)
  useTimelineProgress(timelineRef, opened)

  const videoRef = useRef<HTMLVideoElement>(null)

  function openInvitation() {
    if (opened) return
    setOpened(true)
    const v = videoRef.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setNamesPhase(true); return }
    v.currentTime = 0
    setVideoPlaying(true)
    v.play().catch(() => {
      const retry = () => { v.currentTime = 0; v.play().catch(() => { setVideoStill(true); setNamesPhase(true) }) }
      if (v.readyState >= 3) { retry(); return }
      v.addEventListener('canplay', retry, { once: true })
      setTimeout(() => { v.removeEventListener('canplay', retry); setVideoStill(true); setNamesPhase(true) }, 5000)
    })
    setTimeout(() => setNamesPhase(true), 3800)
  }

  const onVideoEnded = useCallback(() => { setVideoPlaying(false); setVideoStill(true); setNamesPhase(true) }, [])

  const people = d.brideFirst
    ? [{ name: d.bride, person: 'bride' as const }, { name: d.groom, person: 'groom' as const }]
    : [{ name: d.groom, person: 'groom' as const }, { name: d.bride, person: 'bride' as const }]

  const events = d.events.map((event, i) => ({ event, key: event.id || `legacy-${i}` })).sort((a, b) => `${a.event.date}T${a.event.time}`.localeCompare(`${b.event.date}T${b.event.time}`))

  const swatches = [
    { label: 'Midnight', color: '#1a0207' },
    { label: 'Bordeaux', color: '#4a0915' },
    { label: 'Ruby', color: '#8f1426' },
    { label: 'Champagne', color: '#d9b47c' },
    { label: 'Blush', color: '#f7eee6' },
  ]

  const introClasses = `rh-intro${opened ? ' rh-opened' : ''}${videoPlaying ? ' rh-playing' : ''}${videoStill ? ' rh-still' : ''}${namesPhase ? ' rh-names' : ''}`

  return <InvitationLayoutProvider layout={d.textOverrides}><main ref={root} className="ruby-hour" style={opened ? undefined : { overflow: 'hidden', height: '100svh' }}>

    {/* ── 0 · Opening ── */}
    <section className={introClasses} onClick={openInvitation}>
      <InvitationMedia className="rh-intro-blur" src="/templates/ruby-hour/assets/film-ruby-first.jpg" alt="" priority />
      <div className="rh-intro-box">
        <InvitationMedia kind="video" ref={videoRef} className="rh-intro-video" src="/templates/ruby-hour/assets/film-ruby2.mp4" poster="/templates/ruby-hour/assets/film-ruby-first.jpg" muted playsInline preload="auto" onEnded={onVideoEnded} />
        <InvitationMedia className="rh-intro-still" src="/templates/ruby-hour/assets/film-ruby-first.jpg" alt="" priority />
        <InvitationMedia className="rh-intro-last" src="/templates/ruby-hour/assets/film-ruby-last.jpg" alt="" />
      </div>
      <div className="rh-intro-veil" />
      <div className="rh-intro-top">
        <p className="rh-intro-for"><Copy field="opening.forLabel" as="span">An invitation for you</Copy></p>
        <span className="rh-intro-mono">{couple.toUpperCase()}</span>
      </div>
      <div className="rh-intro-hint">
        <p className="rh-intro-blow">Touch</p>
        <p className="rh-intro-or">Tap to open the invitation</p>
      </div>
      <div className="rh-intro-shade" />
      <div className="rh-hero">
        <p className="rh-hero-tog"><Copy field="opening.together" as="span">Together with our families</Copy></p>
        <div className="rh-hero-names">
          <span className="rh-hero-n rh-hero-n--1"><Copy field={`opening.${people[0].person}`} as="span">{people[0].name}</Copy></span>
          <span className="rh-hero-amp">&amp;</span>
          <span className="rh-hero-n rh-hero-n--2"><Copy field={`opening.${people[1].person}`} as="span">{people[1].name}</Copy></span>
        </div>
        <p className="rh-hero-inv"><Copy field="opening.invite" as="span">invite you to their wedding</Copy></p>
        <p className="rh-hero-date">{formatDate(d.date, { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}</p>
        <p className="rh-hero-place"><Copy field="opening.place" as="span">{d.venue}</Copy></p>
      </div>
    </section>

    {opened && <>
      <PersonalMusic src={d.music || ''} />

      {/* ── 2 · Letter ── */}
      <Section ref={letterRef} data-invite-section="letter" className="rh-letter rh-s-night">
        <div className="rh-wrap">
          <h2 className="rh-title rh-rv rh-rv-title"><Copy field="letter.heading" as="span">A letter</Copy></h2>
          <p className="rh-sub rh-rv"><Copy field="letter.sub" as="span">to our loved ones</Copy></p>
        </div>
        <div className="rh-env">
          <div className="rh-env-back" />
          <div className="rh-note">
            <InvitationMedia className="rh-note-pin" src="/templates/ruby-hour/assets/pearl-pin.webp" alt="" />
            <div className="rh-note-hole" />
            <h2><Copy field="letter.dear" as="span">Dear family &amp; friends</Copy></h2>
            <p className="rh-letter-txt"><Copy field="letter.message" as="span">{d.message || 'We are delighted to invite you to share in the joy of our wedding celebration. Your presence would mean the world to us.'}</Copy></p>
            <p className="rh-letter-sig"><Copy field="letter.signature" as="span">{couple}</Copy></p>
          </div>
          <div className="rh-env-front" />
        </div>
      </Section>

      {/* ── 3 · Calendar ── */}
      <section ref={calendarRef} className="rh-sec rh-dsec rh-s-night" style={{ '--rh-n': calendarPages.length } as React.CSSProperties}>
        <div className="rh-dstage">
          <h2 className="rh-title"><Copy field="calendar.heading" as="span">Save the date</Copy></h2>
          <p className="rh-sub"><Copy field="calendar.sub" as="span">Mark your calendar</Copy></p>
          <div className="rh-desk">
            <div className="rh-desk-board" />
            <div className="rh-desk-head">SAVE THE DATE</div>
            {calendarPages.map((pg, index) => {
              const cells = monthGrid(pg.year, pg.month)
              const isWeddingMonth = pg.year === weddingYear && pg.month === weddingMonth
              return <div key={index} className="rh-pg" style={{ zIndex: calendarPages.length - index }}>
                <div className="rh-pg-f">
                  <span className="rh-pg-m">{pg.monthName}</span>
                  <span className="rh-pg-y">{pg.year}</span>
                  <div className="rh-pg-g">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <b key={i}>{day}</b>)}
                    {cells.map((day, i) => {
                      if (day === null) return <span key={`e${i}`} />
                      const we = isWeekend(pg.year, pg.month, day)
                      const isDay = isWeddingMonth && day === weddingDay
                      return <span key={day} className={`${we ? 'rh-we' : ''}${isDay ? ' rh-day' : ''}`}>
                        {day}
                        {isDay && <svg className="rh-ring" viewBox="0 0 100 100"><path d="M85 50c0 20-16 36-35 36S15 70 15 50s16-36 35-36 35 16 35 36" /></svg>}
                      </span>
                    })}
                  </div>
                </div>
                <div className="rh-pg-b" />
              </div>
            })}
            <InvitationMedia className="rh-desk-pearls" src="/templates/ruby-hour/assets/pearls-strand.webp" alt="" />
          </div>
          <div className="rh-dinfo">
            <p className="rh-dinfo-d"><b>{formatDate(d.date, { weekday: 'long' })}</b>{formatDate(d.date, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            {d.time && <p className="rh-dinfo-d">{formatTime(d.time)}</p>}
            <button type="button" className="rh-btn rh-btn--gold" onClick={() => downloadCalendar(wedding, d.offset, couple)}>
              <Copy field="calendar.btn" as="span">ADD TO CALENDAR</Copy>
            </button>
          </div>
        </div>
      </section>

      {/* ── 4 · Timeline ── */}
      <Section data-invite-section="timeline" className="rh-sec rh-s-pearl">
        <div className="rh-lace rh-lace--top" />
        <div className="rh-wrap">
          <h2 className="rh-title rh-rv rh-rv-title" style={{ color: 'var(--rh-ruby)' }}><Copy field="timeline.heading" as="span">The Evening</Copy></h2>
          <p className="rh-sub rh-rv" style={{ color: 'var(--rh-ink)' }}><Copy field="timeline.sub" as="span">How the day will unfold</Copy></p>
          <nav ref={timelineRef} className="rh-eve">
            <div className="rh-eve-line"><i /></div>
            <ol>
              {events.map(({ event, key }) => {
                const schedule = event.schedule || []
                if (schedule.length > 0) {
                  return schedule.map((moment, mi) => <li key={`${key}-${mi}`}>
                    <time>{moment.time ? formatTime(moment.time) : ''}<small>{moment.time ? (parseInt(moment.time.split(':')[0], 10) < 12 ? 'AM' : 'PM') : ''}</small></time>
                    <div className="rh-eve-tx"><b>{moment.title}</b>{moment.description && <span>{moment.description}</span>}</div>
                  </li>)
                }
                return <li key={key}>
                  <time>{event.time ? formatTime(event.time) : ''}<small>{event.time ? (parseInt(event.time.split(':')[0], 10) < 12 ? 'AM' : 'PM') : ''}</small></time>
                  <div className="rh-eve-tx"><b>{event.title}</b><span>{event.venue}</span></div>
                </li>
              })}
            </ol>
          </nav>
        </div>
        <div className="rh-lace rh-lace--bot" />
      </Section>

      {/* ── 5 · Venue ── */}
      <Section data-invite-section="venue" className="rh-sec rh-s-night">
        <div className="rh-wrap">
          <h2 className="rh-title rh-rv rh-rv-title"><Copy field="venue.heading" as="span">Where</Copy></h2>
          <p className="rh-sub rh-rv"><Copy field="venue.sub" as="span">Join us at</Copy></p>
          <div className="rh-arch rh-rv">
            <div className="rh-arch-in">
              <InvitationMedia src={d.hallPhoto || '/templates/ruby-hour/assets/table-red.jpg'} alt={d.venue} />
            </div>
          </div>
          <p className="rh-v-name rh-rv"><Copy field="venue.name" as="span">{d.venue}</Copy></p>
          <p className="rh-v-addr rh-rv"><Copy field="venue.address" as="span">{d.address}</Copy></p>
          <div className="rh-v-acts rh-rv">
            {d.map.trim() && <a className="rh-btn rh-btn--gold rh-btn--wide" href={mapURL(d.venue, d.address, d.map)} target="_blank" rel="noreferrer"><Copy field="venue.directions" as="span">GET DIRECTIONS</Copy></a>}
          </div>
        </div>
      </Section>

      {/* ── 6 · Dress Code ── */}
      {d.dressCode.trim() && <Section data-invite-section="dresscode" className="rh-sec rh-s-silk">
        <div className="rh-lace rh-lace--top" />
        <div className="rh-wrap">
          <h2 className="rh-title rh-rv rh-rv-title"><Copy field="dress.heading" as="span">Dress code</Copy></h2>
          <p className="rh-sub rh-rv"><Copy field="dress.sub" as="span">We&rsquo;d love to see you in</Copy></p>
          <div className="rh-fab rh-rv">
            <figure><InvitationMedia src="/templates/ruby-hour/assets/silk.jpg" alt="Satin" /><figcaption>Satin</figcaption></figure>
            <figure><InvitationMedia src="/templates/ruby-hour/assets/velvet.jpg" alt="Velvet" /><figcaption>Velvet</figcaption></figure>
            <figure><InvitationMedia src="/templates/ruby-hour/assets/fabric-sequins.jpg" alt="Sequins" /><figcaption>Sequins</figcaption></figure>
            <figure><InvitationMedia src="/templates/ruby-hour/assets/fabric-pearls.jpg" alt="Pearls" /><figcaption>Pearls</figcaption></figure>
          </div>
          <ul className="rh-pal rh-rv">
            {swatches.map((sw, i) => <li key={i}>
              <button type="button" style={{ '--rh-swatch': sw.color } as React.CSSProperties} aria-pressed={activeSwatch === i} onClick={() => setActiveSwatch(i)} aria-label={sw.label} />
              <span>{sw.label}</span>
            </li>)}
          </ul>
          <div className="rh-dc rh-rv">
            <div><dt><Copy field="dress.label" as="span">Attire</Copy></dt><dd><Copy field="dress.code" as="span">{d.dressCode}</Copy></dd></div>
          </div>
        </div>
        <div className="rh-lace rh-lace--bot" />
      </Section>}

      {/* ── 7 · Wishes ── */}
      {d.giftNote.trim() && <Section data-invite-section="wishes" className="rh-sec rh-s-pearl">
        <div className="rh-lace rh-lace--top" />
        <div className="rh-wrap">
          <h2 className="rh-title rh-rv rh-rv-title" style={{ color: 'var(--rh-ruby)' }}><Copy field="wishes.heading" as="span">A few wishes</Copy></h2>
          <p className="rh-sub rh-rv" style={{ color: 'var(--rh-ink)' }}><Copy field="wishes.sub" as="span">Before you join us</Copy></p>
          <div className="rh-wish rh-rv">
            <div className="rh-wcard">
              <h3><Copy field="wishes.gifts-heading" as="span">Gifts</Copy></h3>
              <p><Copy field="wishes.gifts" as="span">{d.giftNote}</Copy></p>
            </div>
          </div>
        </div>
        <div className="rh-lace rh-lace--bot" />
      </Section>}

      {/* ── 8 · RSVP ── */}
      <Section data-invite-section="rsvp" className="rh-sec rh-s-velvet">
        <div className="rh-wrap">
          <div className="rh-rsvp-wrap rh-rv">
            <InvitationRsvp template={19} couple={couple} target={rsvpTarget} formOnly envelopeClosed="/templates/ruby-hour/assets/envelope-bordeaux.webp" />
          </div>
        </div>
      </Section>

      {/* ── 10 · Closing ── */}
      <section className="rh-sec rh-closing">
        <div className="rh-wrap">
          <h2 className="rh-title rh-rv rh-rv-title"><Copy field="closing.heading" as="span">Until we meet</Copy></h2>
          <div className="rh-cd rh-rv">
            <div><b>{String(countdown.days).padStart(2, '0')}</b><span>Days</span></div>
            <i>:</i>
            <div><b>{String(countdown.hours).padStart(2, '0')}</b><span>Hours</span></div>
            <i>:</i>
            <div><b>{String(countdown.minutes).padStart(2, '0')}</b><span>Minutes</span></div>
          </div>
          <div className="rh-love rh-rv">
            <p><Copy field="closing.with" as="span">With love</Copy></p>
            <p className="rh-love-names">
              <Copy field={`closing.${people[0].person}`} as="span">{people[0].name}</Copy>
              <em>&amp;</em>
              <Copy field={`closing.${people[1].person}`} as="span">{people[1].name}</Copy>
            </p>
          </div>
        </div>
      </section>
    </>}
  </main></InvitationLayoutProvider>
}
