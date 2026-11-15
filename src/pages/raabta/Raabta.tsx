import { useEffect, useMemo, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import type { Celebration, InvitationData } from '../../invitations/model'
import { formatDate, formatTime, mapURL, weddingISO } from '../../invitations/model'
import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection as Section } from '../../invitations/components/InvitationSection'
import { useRaabtaGate } from './useRaabtaGate'
import { useScratchCard } from './useScratchCard'
import { useScrollReveal } from './useScrollReveal'
import { useHeroFit } from './useHeroFit'
import { useRaabtaMusic } from './useRaabtaMusic'
import { useYoutubeCrosstalk } from './useYoutubeCrosstalk'
import { useFloatingLanterns } from './useFloatingLanterns'
import { useLanternGust } from './useLanternGust'
import RsvpSection from './RsvpSection'
import DesignedByFooter from '../../invitations/components/DesignedByFooter'
import './Raabta.css'

const ASSETS = '/templates/raabta/assets/'
const DEFAULT_MUSIC = '/audios/muslim/wedding-nasheed.mp3'
const FAMILY_MESSAGE = 'With grateful hearts, our families invite you to share in the joy of this beautiful new beginning. As our children begin their journey together, your presence, prayers, and blessings will mean so much to us. Join us as we celebrate their love, welcome one another as family, and make memories to cherish for years to come.'
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Jost:wght@300;400;500;600&display=swap'

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t13.${field}`} label={label || field.replaceAll('.', ' · ')}>{children}</EditableText>
}

const DEMO: InvitationData = {
  template: 13,
  companyName: 'Shaadi Invites',
  companyLogo: '/logo.png',
  groom: 'Mustafa Siddiqui',
  bride: 'Zoya Rahman',
  date: '2027-02-12',
  time: '13:30',
  offset: '+05:30',
  venue: 'Gulmohar Courtyard',
  address: 'Road No. 12, Banjara Hills, Hyderabad',
  map: 'https://www.google.com/maps',
  message: FAMILY_MESSAGE,
  groomFamily: 'Mrs. Farida & Mr. Iqbal Siddiqui',
  brideFamily: 'Mrs. Nasreen & Mr. Aslam Rahman',
  dressCode: 'Formal / Modest Attire',
  giftNote: '',
  music: DEFAULT_MUSIC,
  gallery: '',
  events: [
    { title: 'Mehendi', date: '2027-02-10', time: '16:00', venue: 'Gulmohar Courtyard', address: 'Road No. 12, Banjara Hills, Hyderabad', map: 'https://www.google.com/maps' },
    { title: 'Nikah', date: '2027-02-12', time: '13:30', venue: 'Gulmohar Courtyard', address: 'Road No. 12, Banjara Hills, Hyderabad', map: 'https://www.google.com/maps' },
    { title: 'Rukhsati', date: '2027-02-12', time: '19:00', venue: 'Gulmohar Courtyard', address: 'Road No. 12, Banjara Hills, Hyderabad', map: 'https://www.google.com/maps' },
    { title: 'Walima', date: '2027-02-13', time: '19:00', venue: 'Gulmohar Courtyard', address: 'Road No. 12, Banjara Hills, Hyderabad', map: 'https://www.google.com/maps' },
  ],
}

const STARS = [
  { left: '6%', width: '14px', dur: '12s', delay: '-2s', cls: 'star-a' },
  { left: '16%', width: '10px', dur: '9s', delay: '-6s', cls: 'star-b' },
  { left: '27%', width: '12px', dur: '14s', delay: '-1s', cls: 'star-c' },
  { left: '38%', width: '11px', dur: '10s', delay: '-8s', cls: 'star-a' },
  { left: '49%', width: '15px', dur: '13s', delay: '-4s', cls: 'star-b' },
  { left: '59%', width: '10px', dur: '11s', delay: '-9s', cls: 'star-c' },
  { left: '69%', width: '13px', dur: '15s', delay: '-3s', cls: 'star-a' },
  { left: '78%', width: '9px', dur: '9.5s', delay: '-7s', cls: 'star-b' },
  { left: '87%', width: '14px', dur: '12.5s', delay: '-5s', cls: 'star-c' },
]

const LANTERN_HANGS = [
  { drop: '8px', dur: '4.1s', delay: '-0.9s', tilt: '5deg', w: '62px' },
  { drop: '36px', dur: '5.3s', delay: '-2.4s', tilt: '3.4deg', w: '84px', mid: true },
  { drop: '4px', dur: '4.7s', delay: '-1.7s', tilt: '5.6deg', w: '58px' },
]

function firstName(s: string) { return (s || '').trim().split(/\s+/)[0] || '' }

export default function Raabta({ details: d = DEMO, rsvpTarget }: { details?: InvitationData; rsvpTarget?: RsvpTarget }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRowRef = useRef<HTMLDivElement>(null)
  const heroGroomRef = useRef<HTMLSpanElement>(null)
  const heroBrideRef = useRef<HTMLSpanElement>(null)
  const heroJoinRef = useRef<HTMLSpanElement>(null)
  const scratchCanvasRef = useRef<HTMLCanvasElement>(null)
  const scratchWrapRef = useRef<HTMLDivElement>(null)
  const scratchConfettiRef = useRef<HTMLDivElement>(null)
  const youtubeRef = useRef<HTMLIFrameElement>(null)

  const groomFirst = firstName(d.groom)
  const brideFirst = firstName(d.bride)

  const { opened, openGate, gateRef } = useRaabtaGate()
  const { fallbackReveal } = useScratchCard(scratchCanvasRef, scratchWrapRef, scratchConfettiRef)
  useScrollReveal(rootRef)
  useHeroFit(heroRowRef, heroGroomRef, heroBrideRef, heroJoinRef, groomFirst, brideFirst)

  const { playing, start, toggle, btnRef } = useRaabtaMusic(d.music || DEFAULT_MUSIC)

  const handleOpen = () => {
    if (opened) return
    start()
    openGate()
  }

  const youtubeUrl = useMemo(() => {
    const g = d.gallery || ''
    const match = g.match(/youtube\.com\/embed\/[^\s,]+/)
    if (match) return 'https://www.' + match[0] + '?rel=0'
    return undefined
  }, [d.gallery])
  useYoutubeCrosstalk(youtubeRef, youtubeUrl)
  useFloatingLanterns(rootRef)
  useLanternGust(rootRef)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONTS_URL
    document.head.appendChild(link)
    const preconnect1 = document.createElement('link')
    preconnect1.rel = 'preconnect'
    preconnect1.href = 'https://fonts.googleapis.com'
    document.head.appendChild(preconnect1)
    const preconnect2 = document.createElement('link')
    preconnect2.rel = 'preconnect'
    preconnect2.href = 'https://fonts.gstatic.com'
    preconnect2.crossOrigin = 'anonymous'
    document.head.appendChild(preconnect2)
    return () => { link.remove(); preconnect1.remove(); preconnect2.remove() }
  }, [])

  useEffect(() => {
    document.title = `${d.groom} & ${d.bride} — Wedding Invitation`
  }, [d.groom, d.bride])

  const [wishName, setWishName] = useState('')
  const [wishMsg, setWishMsg] = useState('')
  const [wishStatus, setWishStatus] = useState('')

  const handleWish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wishName.trim() || !wishMsg.trim()) return
    if (rsvpTarget) {
      setWishStatus('Sending...')
      rsvpTarget.submitWish?.({ guestName: wishName, message: wishMsg })
        .then(() => {
          setWishName(''); setWishMsg('')
          setWishStatus('Your wish has been shared.')
        })
        .catch(() => setWishStatus('Could not share your wish right now.'))
    } else {
      setWishName(''); setWishMsg('')
      setWishStatus('Your wish has been shared.')
    }
  }

  const groomFamilyLines = d.groomFamily.split('\n').filter(Boolean)
  const brideFamilyLines = d.brideFamily.split('\n').filter(Boolean)

  const prettyDate = formatDate(d.date)

  const [cd, setCd] = useState({ days: '00', hours: '00', mins: '00', secs: '00' })
  useEffect(() => {
    const iso = weddingISO(d)
    function tick() {
      const dist = new Date(iso).getTime() - Date.now()
      if (dist < 0) { setCd({ days: '00', hours: '00', mins: '00', secs: '00' }); return }
      setCd({
        days: String(Math.floor(dist / 86400000)).padStart(2, '0'),
        hours: String(Math.floor((dist % 86400000) / 3600000)).padStart(2, '0'),
        mins: String(Math.floor((dist % 3600000) / 60000)).padStart(2, '0'),
        secs: String(Math.floor((dist % 60000) / 1000)).padStart(2, '0'),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [d])

  return (
    <InvitationLayoutProvider layout={d.textOverrides} manualLayout={d.textOverrides ?? null}>
      <div ref={rootRef} className="raabta-native">

        {/* ── Gate ── */}
        <div className="gate-overlay" ref={gateRef} role="button" tabIndex={0}
             aria-label="Tap to open" onClick={handleOpen}
             onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen() } }}>
          <div className="gate-leaf gate-leaf-left" />
          <div className="gate-leaf gate-leaf-right" />
          <div className="gate-flare" />
          <div className="gate-cta">
            <div className="gate-cta-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <div className="gate-cta-names">
              <Copy as="span" field="gate.groom" className="gate-cta-groom" label="Gate groom">{d.groom}</Copy>
              <span className="gate-cta-amp">&amp;</span>
              <Copy as="span" field="gate.bride" className="gate-cta-bride" label="Gate bride">{d.bride}</Copy>
            </div>
            <div className="gate-cta-tap">Tap to Enter</div>
          </div>
        </div>

        {/* ── Scene 1: Hero ── */}
        <Section data-invite-section="hero">
        <div className="scene scene-hero">
          <img src={`${ASSETS}mosque-scene.webp`} alt="" className="scene-hero-mosque" />
          <div className="stars" aria-hidden="true">
            {STARS.map((s, i) => (
              <div key={i} className={`star ${s.cls}`} style={{ left: s.left, width: s.width, animationDuration: s.dur, animationDelay: s.delay }} />
            ))}
          </div>
          <div className="scene-hero-content">
            <img src={`${ASSETS}crescent-moon.webp`} alt="" className="scene-hero-moon" />
            <div className="hero-names-row" ref={heroRowRef}>
              <Copy as="span" field="hero.groom" className="hero-name" label="Hero groom" ref={heroGroomRef}>{groomFirst}</Copy>
              <span className="hero-join" ref={heroJoinRef}>&amp;</span>
              <Copy as="span" field="hero.bride" className="hero-name" label="Hero bride" ref={heroBrideRef}>{brideFirst}</Copy>
            </div>
            <div className="hero-rule" aria-hidden="true" />
            <Copy as="div" field="hero.blessing" className="hero-blessing" label="Hero blessing">Together with our families, we joyfully invite you</Copy>
          </div>
        </div>
        </Section>

        {/* ── Scene 2: Blessings ── */}
        <Section data-invite-section="blessing">
        <div className="scene scene-blessing scene-crowned">
          <div className="scene-inner">
            <div className="vessel reveal">
              <img src={`${ASSETS}corner-spray.webp`} alt="" className="vessel-corner vessel-corner-tl" />
              <img src={`${ASSETS}corner-spray.webp`} alt="" className="vessel-corner vessel-corner-tr" />
              <img src={`${ASSETS}corner-spray.webp`} alt="" className="vessel-corner vessel-corner-bl" />
              <img src={`${ASSETS}corner-spray.webp`} alt="" className="vessel-corner vessel-corner-br" />
              <img src={`${ASSETS}bismillah-medallion.webp`} alt="Bismillah" className="scene-medallion reveal" />

              <Copy as="div" field="blessing.text" className="invite-blessing reveal" label="Blessing">With the blessings of Almighty God</Copy>

              <div className="invite-person-block reveal">
                <Copy as="div" field="blessing.groom" className="invite-person-name" label="Groom name">{d.groom}</Copy>
                <Copy as="div" field="blessing.groomFamily" className="invite-person-family" label="Groom family">{groomFamilyLines.join(', ')}</Copy>
              </div>

              <div className="invite-divider reveal" />

              <div className="invite-person-block reveal">
                <Copy as="div" field="blessing.bride" className="invite-person-name" label="Bride name">{d.bride}</Copy>
                <Copy as="div" field="blessing.brideFamily" className="invite-person-family" label="Bride family">{brideFamilyLines.join(', ')}</Copy>
              </div>
            </div>
          </div>
        </div>
        </Section>

        {/* ── Scene 3: Nikah Invite + Scratch Card ── */}
        <Section data-invite-section="invite">
        <div className="scene scene-invite">
          <div className="scene-inner">
            <img src={`${ASSETS}lattice-arch.webp`} alt="" className="scene-arch reveal" />
            <Copy as="h1" field="invite.title" className="invite-title reveal" label="Invite title">Nikah</Copy>
            <Copy as="div" field="invite.subtitle" className="invite-join reveal" label="Invite subtitle">request the honour of your presence at the wedding of</Copy>
            <Copy as="div" field="invite.groom" className="invite-person reveal" label="Invite groom">{d.groom}</Copy>
            <div className="invite-amp reveal">&amp;</div>
            <Copy as="div" field="invite.bride" className="invite-person reveal" label="Invite bride">{d.bride}</Copy>
            <div className="invite-divider reveal" />

            <div className="scratch-date-wrap reveal" ref={scratchWrapRef}>
              <div className="scratch-date-box">
                <span className="scratch-date-text">{prettyDate}</span>
                <canvas className="scratch-date-canvas" ref={scratchCanvasRef} aria-hidden="true" />
              </div>
              <button className="scratch-date-fallback" type="button" onClick={fallbackReveal}>Tap to reveal the date</button>
            </div>
            <div className="confetti-burst" ref={scratchConfettiRef} aria-hidden="true" />
          </div>
        </div>
        </Section>

        {/* ── Function Scenes ── */}
        <div className="functions-run">
          {(d.events || []).map((event, i) => (
            <Section key={event.id || `fn-${i}`} data-invite-section={`function-${i}`}>
            <div className="scene scene-function">
              <div className="function-card reveal">
                <img src={`${ASSETS}corner-spray.webp`} alt="" className="fn-corner fn-corner-tl" />
                <img src={`${ASSETS}corner-spray.webp`} alt="" className="fn-corner fn-corner-tr" />
                <img src={`${ASSETS}corner-spray.webp`} alt="" className="fn-corner fn-corner-bl" />
                <img src={`${ASSETS}corner-spray.webp`} alt="" className="fn-corner fn-corner-br" />
                <Copy as="h3" field={`fn.${event.id || i}.title`} className="fn-name" label={`${event.title} title`}>{event.title}</Copy>
                <div className="invite-divider fn-divider" />
                <p className="fn-row">{formatDate(event.date)}</p>
                {event.time && <p className="fn-row">{formatTime(event.time)} Onwards</p>}
                <p className="fn-row">{event.venue}<br />{event.address}</p>
                {event.map && (
                  <a href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noopener noreferrer" className="fn-map">See the route</a>
                )}
                {d.dressCode && i === 0 && <p className="fn-dress">{d.dressCode}</p>}
              </div>
            </div>
            </Section>
          ))}
        </div>

        {/* ── Message from the Family ── */}
        <Section data-invite-section="family-message">
          <div className="scene scene-couple">
            <div className="scene-inner">
              <Copy as="h2" field="family.title" className="meet-title reveal" label="Family message title">A Message from the Family</Copy>
              <div className="invite-divider reveal" />
              <Copy as="p" field="family.message" className="meet-story reveal" label="Family message">{d.message.trim() || FAMILY_MESSAGE}</Copy>
            </div>
          </div>
        </Section>

        {/* ── Video ── */}
        {youtubeUrl && (
          <Section data-invite-section="video">
          <div className="scene scene-video">
            <div className="scene-inner">
              <Copy as="h2" field="video.title" className="video-title reveal" label="Video title">On Screen</Copy>
              <Copy as="p" field="video.caption" className="video-caption reveal" label="Video caption">Take a moment to watch our pre-wedding film — a little piece of our story before we begin this new chapter.</Copy>
              <div className="video-embed-wrap reveal">
                <iframe
                  ref={youtubeRef}
                  src={youtubeUrl}
                  title="Pre-wedding film"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
          </Section>
        )}

        {/* ── Lantern Divider ── */}
        <div className="lantern-divider">
          <div className="hang-row reveal">
            {LANTERN_HANGS.map((h, i) => (
              <div key={i} className={`hang${h.mid ? ' hang-mid' : ''}`}
                   style={{ '--drop': h.drop, '--dur': h.dur, '--delay': h.delay, '--tilt': h.tilt, '--w': h.w } as React.CSSProperties}>
                <img src={`${ASSETS}lantern-float.webp`} alt={i === 1 ? 'Lanterns' : ''} className="hang-img" />
                <span className="hang-glow" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        {/* ── Things to Know ── */}
        <Section data-invite-section="things">
        <div className="scene scene-things scene-crowned">
          <div className="scene-inner">
            <div className="vessel reveal">
              <img src={`${ASSETS}corner-spray.webp`} alt="" className="vessel-corner vessel-corner-tl" />
              <img src={`${ASSETS}corner-spray.webp`} alt="" className="vessel-corner vessel-corner-tr" />
              <img src={`${ASSETS}corner-spray.webp`} alt="" className="vessel-corner vessel-corner-bl" />
              <img src={`${ASSETS}corner-spray.webp`} alt="" className="vessel-corner vessel-corner-br" />
              <Copy as="h2" field="things.title" className="things-title reveal" label="Things title">Things to Know</Copy>
              <div className="invite-divider reveal" />

              <div className="thing-row reveal">
                <div className="thing-sub">Venue</div>
                <Copy as="div" field="things.venue" className="thing-val" label="Venue">{d.venue}</Copy>
                <Copy as="div" field="things.address" className="thing-desc" label="Address">{d.address}</Copy>
              </div>

              <div className="thing-row reveal">
                <div className="thing-sub">Contact</div>
                <Copy as="div" field="things.contact" className="thing-val" label="Contact name">{groomFamilyLines[0] || d.groom}</Copy>
                <Copy as="div" field="things.contactPhone" className="thing-desc" label="Contact phone">9999999999</Copy>
              </div>

              {d.giftNote && (
                <div className="thing-row reveal">
                  <div className="thing-sub">A Friendly Reminder</div>
                  <Copy as="div" field="things.reminder" className="thing-val thing-italic" label="Reminder">{d.giftNote}</Copy>
                </div>
              )}
              {!d.giftNote && (
                <div className="thing-row reveal">
                  <div className="thing-sub">A Friendly Reminder</div>
                  <Copy as="div" field="things.reminder" className="thing-val thing-italic" label="Reminder">Don&rsquo;t miss the dessert counter.</Copy>
                </div>
              )}
            </div>
          </div>
        </div>
        </Section>

        {/* ── Countdown ── */}
        <Section data-invite-section="countdown">
        <div className="scene scene-countdown">
          <div className="scene-inner">
            <div className="countdown-sub">Counting down</div>
            <Copy as="h2" field="countdown.title" className="countdown-title reveal" label="Countdown title">Until the Nikah</Copy>
            <div className="countdown-date">{prettyDate}</div>
            <div className="countdown-timer">
              <div className="countdown-box">
                <span className="countdown-val">{cd.days}</span>
                <span className="countdown-lbl">Days</span>
              </div>
              <div className="countdown-box">
                <span className="countdown-val">{cd.hours}</span>
                <span className="countdown-lbl">Hours</span>
              </div>
              <div className="countdown-box">
                <span className="countdown-val">{cd.mins}</span>
                <span className="countdown-lbl">Mins</span>
              </div>
              <div className="countdown-box">
                <span className="countdown-val">{cd.secs}</span>
                <span className="countdown-lbl">Secs</span>
              </div>
            </div>
          </div>
        </div>
        </Section>

        {/* ── RSVP + Wishes ── */}
        <Section data-invite-section="rsvp">
        <div className="scene scene-rsvp">
          <div className="scene-inner">

            <RsvpSection rsvpTarget={rsvpTarget} />

            <div style={{ marginTop: '6vh' }}>
              <Copy as="h2" field="wishes.title" className="rsvp-title reveal" label="Wishes title">Share Your Blessings</Copy>
              <div className="invite-divider reveal" />
              <form className="wishes-form" onSubmit={handleWish}>
                <div className="rsvp-row">
                  <svg className="rsvp-icon" viewBox="0 0 24 24" fill="none" stroke="#8C6318" strokeWidth="1.5" width="22" height="22"><circle cx="12" cy="7.5" r="3.5"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg>
                  <span className="rsvp-sep" />
                  <input type="text" required className="rsvp-input" placeholder="Your name" value={wishName} onChange={e => setWishName(e.target.value)} />
                </div>
                <div className="rsvp-row" style={{ height: 'auto', minHeight: '56px', alignItems: 'flex-start', paddingTop: '14px', paddingBottom: '14px' }}>
                  <svg className="rsvp-icon" style={{ marginTop: '2px' }} viewBox="0 0 24 24" fill="none" stroke="#8C6318" strokeWidth="1.5" width="22" height="22"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span className="rsvp-sep" />
                  <textarea required className="rsvp-input rsvp-textarea" placeholder="Write your wish" value={wishMsg} onChange={e => setWishMsg(e.target.value)} />
                </div>
                <button type="submit" className="rsvp-submit">
                  <svg viewBox="0 0 24 24" fill="#1A2340" width="20" height="20"><path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/></svg>
                  Send Wish
                </button>
                {wishStatus && <p style={{ marginTop: '10px', fontSize: '0.85rem', textAlign: 'center', color: wishStatus.includes('Could not') ? '#E58F8F' : 'var(--gold-300)' }}>{wishStatus}</p>}
              </form>
            </div>

            {/* ── Footer ── */}
            <div className="footer-ending">
              <img src={`${ASSETS}footer-ornament.webp`} alt="" className="footer-ornament" />
              <DesignedByFooter />
            </div>

          </div>
        </div>
        </Section>

        {/* ── Music Button ── */}
        <button className={`music-btn${playing ? ' is-playing' : ''}`}
                ref={btnRef}
                onClick={toggle}
                aria-label={playing ? 'Pause music' : 'Play music'}>
          <svg className="music-icon-note" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: playing ? 'none' : 'block' }}>
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/>
          </svg>
          <svg className="music-icon-pause" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: playing ? 'block' : 'none' }}>
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
          </svg>
        </button>

      </div>
    </InvitationLayoutProvider>
  )
}
