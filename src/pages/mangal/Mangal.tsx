import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import type { Celebration, InvitationData } from '../../invitations/model'
import { formatDate, formatTime, mapURL, weddingISO } from '../../invitations/model'
import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection as Section } from '../../invitations/components/InvitationSection'
import { useParallaxScenes } from '../shared/cinematic/useParallaxScenes'
import { useCinematicGate } from '../shared/cinematic/useCinematicGate'
import { useLayerLoading } from '../shared/cinematic/useLayerLoading'
import { Countdown } from '../shared/cinematic/Countdown'
import { FloatingLanterns } from '../shared/cinematic/FloatingLanterns'
import { MusicToggle } from '../shared/cinematic/MusicToggle'
import './Mangal.css'

const ASSETS = '/templates/mangal/assets/'
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&family=Tiro+Devanagari+Hindi:ital@0;1&display=swap'

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t15.${field}`} label={label || field.replaceAll('.', ' · ')}>{children}</EditableText>
}

const DEMO: InvitationData = {
  template: 15,
  groom: 'Arjun',
  bride: 'Priya',
  date: '2027-02-14',
  time: '11:00',
  offset: '+05:30',
  venue: 'Royal Garden Venue',
  address: 'MG Road, Bandra West, Mumbai',
  map: 'https://www.google.com/maps',
  message: 'We are both so happy that you will be with us as we begin our life together. Since our engagement, the love and blessings we have received from our families and friends have touched us more deeply than we can say. We would like to thank each of you sincerely for your kindness, your warmth and your prayers. We would be honoured to have you with us at our wedding, and we look forward to celebrating with you.',
  groomFamily: 'Mr. Rajesh Sharma\nMrs. Sunita Sharma',
  brideFamily: 'Mr. Vikram Patel\nMrs. Meera Patel',
  dressCode: 'Traditional / Formal',
  giftNote: '',
  music: '/templates/mangal/Made In Heaven.mp3',
  gallery: '',
  events: [
    { title: 'Wedding', date: '2027-02-14', time: '11:00', venue: 'Royal Garden Venue', address: 'MG Road, Bandra West, Mumbai', map: 'https://www.google.com/maps' },
    { title: 'Reception', date: '2027-02-14', time: '19:00', venue: 'Royal Garden Venue', address: 'MG Road, Bandra West, Mumbai', map: 'https://www.google.com/maps' },
  ],
}

export default function Mangal({ details: d = DEMO, rsvpTarget }: { details?: InvitationData; rsvpTarget?: RsvpTarget }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLElement>(null)
  const scene4Ref = useRef<HTMLElement>(null)
  const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const { opened, openGate } = useCinematicGate(rootRef)

  const refreshGateArt = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const art = root.querySelector<HTMLElement>('.gate__art')
    if (!art) return
    const portrait = window.matchMedia('(max-width: 720px)').matches || window.matchMedia('(min-width: 721px) and (max-width: 1024px) and (orientation: portrait)').matches
    const url = portrait ? `${ASSETS}gate/00-gate-p.webp` : `${ASSETS}gate/00-gate.webp`
    art.style.setProperty('--gate-bg', `url("${url}")`)
    const afterStyle = art.querySelector('style') || (() => { const s = document.createElement('style'); art.appendChild(s); return s })()
    afterStyle.textContent = `.mangal-native .gate__art::after { background-image: url("${url}"); }`
    art.classList.add('is-ready')
  }, [])

  useLayerLoading(rootRef, refreshGateArt)
  useParallaxScenes(scrollerRef, opened, reduceMotion)

  useEffect(() => { refreshGateArt() }, [refreshGateArt])

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

  const [rsvpName, setRsvpName] = useState('')
  const [rsvpCount, setRsvpCount] = useState(1)
  const [rsvpMessage, setRsvpMessage] = useState('')
  const [rsvpStatus, setRsvpStatus] = useState('')
  const [wishName, setWishName] = useState('')
  const [wishMsg, setWishMsg] = useState('')
  const [wishStatus, setWishStatus] = useState('')
  const [wishes, setWishes] = useState<{ name: string; message: string }[]>([])
  const [wishModalOpen, setWishModalOpen] = useState(false)

  const handleRsvp = (e: React.FormEvent) => {
    e.preventDefault()
    if (rsvpTarget) {
      setRsvpStatus('Sending...')
      rsvpTarget.submitRsvp?.({ guestName: rsvpName, attending: 'yes', plusCount: rsvpCount, message: rsvpMessage })
        .then(() => setRsvpStatus('Thank you for your RSVP!'))
        .catch(() => setRsvpStatus('Something went wrong. Please try again.'))
    } else {
      setRsvpStatus('Thank you for your RSVP!')
    }
  }

  const handleWish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wishName.trim() || !wishMsg.trim()) return
    if (rsvpTarget) {
      setWishStatus('Sending...')
      rsvpTarget.submitWish?.({ guestName: wishName, message: wishMsg })
        .then(() => {
          setWishes(prev => [{ name: wishName, message: wishMsg }, ...prev])
          setWishName(''); setWishMsg('')
          setWishStatus('Your blessing has been sent!')
        })
        .catch(() => setWishStatus('Something went wrong. Please try again.'))
    } else {
      setWishes(prev => [{ name: wishName, message: wishMsg }, ...prev])
      setWishName(''); setWishMsg('')
      setWishStatus('Your blessing has been sent!')
    }
  }

  const groomFamilyLines = d.groomFamily.split('\n').filter(Boolean)
  const brideFamilyLines = d.brideFamily.split('\n').filter(Boolean)

  return (
    <InvitationLayoutProvider layout={d.textOverrides} manualLayout={d.textOverrides ?? null}>
      <div ref={rootRef} className="mangal-native">

        {/* ── Gate ── */}
        <div className="gate" id="gate">
          <div className="gate__art" aria-hidden="true"
               data-bg={`${ASSETS}gate/00-gate.webp`} data-bg-p={`${ASSETS}gate/00-gate-p.webp`} />
          <div className="gate__inner">
            <Copy as="p" field="gate.invocation" className="invocation" lang="hi" label="Invocation">{'श्री गणेशाय नमः'}</Copy>
            <Copy as="p" field="gate.eyebrow" className="gate__eyebrow" label="Gate eyebrow">You are invited to the Wedding of</Copy>
            <h1 className="gate__names">
              <Copy as="span" field="gate.groom" label="Groom name">{d.groom}</Copy>
              <span className="gate__amp">&amp;</span>
              <Copy as="span" field="gate.bride" label="Bride name">{d.bride}</Copy>
            </h1>
            <Copy as="p" field="gate.date" className="gate__date" label="Gate date">{formatDate(d.date)}</Copy>
            <button className="gate__btn" type="button" onClick={openGate}>Open the invitation</button>
          </div>
        </div>

        {/* ── Scroller ── */}
        <main className="scroller" ref={scrollerRef}>

          {/* ═══ Scene 1 — Temple dawn ═══ */}
          <Section as="section" className="panel" data-scene="1" data-text="top-center" data-tint="warm">
            <div className="layer bg" data-depth="0" data-bg={`${ASSETS}scene1/01-temple-dawn.webp`} data-bg-p={`${ASSETS}scene1/01-temple-dawn-p.webp`} />
            <div className="layer el fig-left" data-depth="8" data-src={`${ASSETS}scene1/02-her.webp`} />
            <div className="layer el fig-right" data-depth="10" data-src={`${ASSETS}scene1/03-him.webp`} />

            <div className="panel__inner">
              <Copy as="p" field="scene1.invocation" className="invocation invocation--sm" lang="hi" label="Invocation">{'श्री गणेशाय नमः'}</Copy>
              <Copy as="p" field="scene1.eyebrow" className="eyebrow" label="Scene 1 eyebrow">Shree Ganeshaya Namah</Copy>
              <h1 className="names names--stacked">
                <Copy as="span" field="scene1.groom" className="names__name" label="Groom name">{d.groom}</Copy>
                <span className="names__weds">&amp;</span>
                <Copy as="span" field="scene1.bride" className="names__name" label="Bride name">{d.bride}</Copy>
              </h1>
              <Copy as="p" field="scene1.lede" className="lede" label="Scene 1 tagline">are getting married</Copy>
            </div>
            <div className="cue" aria-hidden="true">Scroll</div>
          </Section>

          {/* ═══ Scene 2 — Haveli courtyard · families ═══ */}
          <Section as="section" className="panel" data-scene="2" data-text="center" data-tint="warm">
            <div className="layer bg" data-depth="0" data-bg={`${ASSETS}scene2/01-courtyard.webp`} data-bg-p={`${ASSETS}scene2/01-courtyard-p.webp`} />
            <div className="layer el fill glow" data-depth="8" data-src={`${ASSETS}golden-bokeh.webp`} />
            <div className="layer el toplights" data-depth="24" data-src={`${ASSETS}scene2/04-lanterns.webp`} />
            <div className="layer el toplights toplights--row2" data-depth="18" data-src={`${ASSETS}scene2/04-lanterns.webp`} />

            <div className="panel__inner panel__inner--wide">
              <Copy as="p" field="scene2.eyebrow" className="eyebrow" label="Families eyebrow">Together with our families</Copy>

              <div className="families">
                <div className="family">
                  <Copy as="p" field="scene2.groomLabel" className="family__label family__person-name" label="Groom label">{d.groom}</Copy>
                  {groomFamilyLines.map((line, i) => (
                    <Copy key={i} as="p" field={`scene2.groomFamily.${i}`} className="family__name" label={`Groom family ${i + 1}`}>{line}</Copy>
                  ))}
                </div>

                <div className="family__sep" aria-hidden="true">
                  <img src={`${ASSETS}rangoli-motif.webp`} alt="" />
                </div>

                <div className="family">
                  <Copy as="p" field="scene2.brideLabel" className="family__label family__person-name" label="Bride label">{d.bride}</Copy>
                  {brideFamilyLines.map((line, i) => (
                    <Copy key={i} as="p" field={`scene2.brideFamily.${i}`} className="family__name" label={`Bride family ${i + 1}`}>{line}</Copy>
                  ))}
                </div>
              </div>

              {d.message && <Copy as="p" field="scene2.message" className="lede lede--story" label="Welcome message">{d.message}</Copy>}
            </div>
          </Section>

          {/* ═══ Scene 3 — Diya night · date + countdown ═══ */}
          <Section as="section" className="panel" data-scene="3" data-text="top-right" data-tint="cool">
            <div className="layer bg" data-depth="0" data-bg={`${ASSETS}scene3/01-diya-night.webp`} data-bg-p={`${ASSETS}scene3/01-diya-night-p.webp`} />
            <div className="layer el fill glow" data-depth="7" data-src={`${ASSETS}warm-lampglow.webp`} />
            <div className="layer el fig-center" data-depth="16" data-src={`${ASSETS}scene3/02-couple-seated.webp`} />

            <div className="panel__inner">
              <Copy as="p" field="scene3.eyebrow" className="eyebrow" label="Date eyebrow">Save the date</Copy>
              <Copy as="h2" field="scene3.date" className="date-big" label="Date">{formatDate(d.date)}</Copy>
              <Copy as="p" field="scene3.venue" className="lede" label="Venue">{d.venue}</Copy>
              <Countdown targetDate={d.date} targetTime={d.time} offset={d.offset} />
            </div>
          </Section>

          {/* ═══ Scene 4 — Festive courtyard · celebrations ═══ */}
          <Section as="section" ref={scene4Ref} className="panel panel--tall" data-scene="4" data-text="bottom-left" data-tint="warm" data-lantern={`${ASSETS}diya-float.webp`}>
            <div className="layer bg" data-depth="0" data-bg={`${ASSETS}scene4/01-festive-court.webp`} data-bg-p={`${ASSETS}scene4/01-festive-court-p.webp`} />
            <div className="layer el fig-center" data-depth="16" data-src={`${ASSETS}scene4/02-festive-moment.webp`} />

            <FloatingLanterns src={`${ASSETS}diya-float.webp`} scrollerRef={scrollerRef} sceneRef={scene4Ref} />

            <div className="panel__inner panel__inner--wide">
              <Copy as="p" field="scene4.eyebrow" className="eyebrow" label="Celebrations eyebrow">The celebrations</Copy>
              <Copy as="h2" field="scene4.title" className="scene-title" label="Celebrations title">Join us</Copy>

              <div className="functions">
                {d.events.map((event, i) => (
                  <article key={event.id || i} className="fn">
                    <Copy as="h3" field={`scene4.event.${i}.title`} className="fn__name" label={`Event ${i + 1} name`}>{event.title}</Copy>
                    <div className="fn__when">
                      <span className="fn__date">{formatDate(event.date)}</span>
                      {event.time && <span className="fn__time">{formatTime(event.time)} Onwards</span>}
                    </div>
                    <p className="fn__venue">
                      <Copy as="span" field={`scene4.event.${i}.venue`} label={`Event ${i + 1} venue`}>{event.venue}</Copy>
                      <Copy as="span" field={`scene4.event.${i}.address`} className="fn__addr" label={`Event ${i + 1} address`}>{event.address}</Copy>
                    </p>
                    {d.dressCode && <p className="fn__meta"><span>Dress code</span> {d.dressCode}</p>}
                    {event.map && <a className="fn__map" href={mapURL(event.venue, event.address, event.map)} target="_blank" rel="noopener noreferrer">See the route</a>}
                  </article>
                ))}
              </div>
            </div>
          </Section>

          {/* ═══ Scene 6 — The Wedding · ceremony ═══ */}
          <Section as="section" className="panel" data-scene="6" data-text="top-left" data-tint="warm">
            <div className="layer bg" data-depth="0" data-bg={`${ASSETS}scene6/01-mandap-night.webp`} data-bg-p={`${ASSETS}scene6/01-mandap-night-p.webp`} />
            <div className="layer el fig-center" data-depth="16" data-src={`${ASSETS}scene6/02-ceremony-moment.webp`} />

            <div className="panel__inner">
              <img className="crest crest--sm" src={`${ASSETS}om-motif.webp`} alt="" aria-hidden="true" />
              <Copy as="p" field="scene6.eyebrow" className="eyebrow" label="Ceremony eyebrow">The Wedding</Copy>
              <Copy as="h2" field="scene6.title" className="scene-title" label="Ceremony title">Our Sacred Union</Copy>
              <Copy as="p" field="scene6.note" className="lede nikah-note" label="Ceremony note">With blessings and joy, we invite you to witness our sacred union and celebrate the beginning of our life together.</Copy>
              <div className="nikah-details">
                <Copy as="p" field="scene6.venue" className="lede nikah-venue" label="Ceremony venue">{d.venue}</Copy>
                <Copy as="p" field="scene6.address" className="lede nikah-address" label="Ceremony address">{d.address}</Copy>
                <div className="nikah-date-time">
                  <Copy as="p" field="scene6.date" className="lede nikah-date" label="Ceremony date">{formatDate(d.date)}</Copy>
                  {d.time && <Copy as="p" field="scene6.time" className="lede nikah-time" label="Ceremony time">{formatTime(d.time)}</Copy>}
                </div>
              </div>
            </div>
          </Section>

          {/* ═══ Scene 7 — RSVP ═══ */}
          <Section as="section" className="panel panel--tall" data-scene="7" data-text="bottom-right" data-tint="warm">
            <div className="layer bg" data-depth="0" data-bg={`${ASSETS}scene7/01-garden-pavilion.webp`} data-bg-p={`${ASSETS}scene7/01-garden-pavilion-p.webp`} />
            <div className="layer el fill glow" data-depth="6" data-src={`${ASSETS}golden-bokeh.webp`} />
            <div className="layer el fig-center" data-depth="16" data-src={`${ASSETS}scene7/02-couple-close.webp`} />

            <div className="panel__inner">
              <div className="card card--rsvp">
                <form className="form rsvp-form" onSubmit={handleRsvp}>
                  <input type="hidden" name="attending" value="yes" />
                  <Copy as="h2" field="scene7.rsvpTitle" className="scene-title rsvp-heading" label="RSVP heading">Will you be attending <em>our wedding?</em></Copy>
                  <input
                    className="rsvp-line-input"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    aria-label="Your name"
                    value={rsvpName}
                    onChange={e => setRsvpName(e.target.value)}
                  />
                  <div className="rsvp-count-row">
                    <span>Number of guests</span>
                    <div className="rsvp-count-controls">
                      <button type="button" aria-label="Remove one guest" onClick={() => setRsvpCount(c => Math.max(1, c - 1))}>&#8722;</button>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        step={1}
                        value={rsvpCount}
                        aria-label="Number of guests"
                        onChange={e => { const n = parseInt(e.target.value); if (n >= 1 && n <= 10) setRsvpCount(n) }}
                      />
                      <button type="button" aria-label="Add one guest" onClick={() => setRsvpCount(c => Math.min(10, c + 1))}>+</button>
                    </div>
                  </div>
                  <textarea
                    className="rsvp-message"
                    rows={1}
                    placeholder="A personal message for us..."
                    aria-label="A personal message for us"
                    value={rsvpMessage}
                    onChange={e => setRsvpMessage(e.target.value)}
                  />
                  <button className="btn btn--solid rsvp-submit" type="submit">Submit RSVP</button>
                  {rsvpStatus && <p className="status" role="status" aria-live="polite">{rsvpStatus}</p>}
                </form>
              </div>
            </div>
          </Section>

          {/* ═══ Scene 8 — Blessings (finale) ═══ */}
          <Section as="section" className="panel panel--tall panel--finale" data-scene="8" data-text="top-left" data-tint="warm">
            <div className="layer bg" data-depth="0" data-bg={`${ASSETS}scene8/01-starlit-court.webp`} data-bg-p={`${ASSETS}scene8/01-starlit-court-p.webp`} />
            <div className="layer el fig-seated" data-depth="15" data-src={`${ASSETS}scene8/02-couple-sit.webp`} />

            <div className="panel__inner panel__inner--wide">
              <div className="card">
                <Copy as="p" field="scene8.eyebrow" className="eyebrow" label="Blessings eyebrow">Blessings for the couple</Copy>
                <Copy as="h2" field="scene8.title" className="scene-title" label="Blessings title">Aashirvaad</Copy>
                <form className="form" onSubmit={handleWish}>
                  <div className="field">
                    <label htmlFor="wish-name">Your name</label>
                    <input id="wish-name" type="text" required autoComplete="name" value={wishName} onChange={e => setWishName(e.target.value)} />
                  </div>
                  <div className="field">
                    <label htmlFor="wish-msg">Your blessing</label>
                    <textarea id="wish-msg" rows={3} required value={wishMsg} onChange={e => setWishMsg(e.target.value)} />
                  </div>
                  <button className="btn btn--solid" type="submit">Send your blessing</button>
                  {wishStatus && <p className="status" role="status" aria-live="polite">{wishStatus}</p>}
                </form>

                {wishes.length > 0 && (
                  <div className="wishwall">
                    {wishes.slice(0, 4).map((w, i) => (
                      <div key={i} className="wish">
                        <p className="wish__name">{w.name}</p>
                        <p className="wish__msg">{w.message}</p>
                      </div>
                    ))}
                  </div>
                )}
                {wishes.length > 4 && (
                  <button className="wish-viewall" type="button" onClick={() => setWishModalOpen(true)}>View all blessings</button>
                )}
              </div>

              <footer className="footer">
                <img className="footer__orn" src={`${ASSETS}footer-ornament.webp`} alt="" aria-hidden="true" />
                <Copy as="p" field="scene8.footerNames" className="footer__names" label="Footer names">{d.groom} &amp; {d.bride}</Copy>
                <Copy as="p" field="scene8.footerDate" className="footer__date" label="Footer date">{formatDate(d.date)}</Copy>
              </footer>
            </div>
          </Section>

        </main>

        {/* ── Wish modal ── */}
        {wishModalOpen && (
          <div className="wishmodal">
            <div className="wishmodal__scrim" onClick={() => setWishModalOpen(false)} />
            <div className="wishmodal__panel" role="dialog" aria-modal="true" aria-labelledby="wishmodal-title">
              <div className="wishmodal__head">
                <h3 className="wishmodal__title" id="wishmodal-title">Blessings for the couple</h3>
                <button className="wishmodal__close" type="button" aria-label="Close all blessings" onClick={() => setWishModalOpen(false)}>&times;</button>
              </div>
              <div className="wishmodal__list">
                {wishes.map((w, i) => (
                  <div key={i} className="wish">
                    <p className="wish__name">{w.name}</p>
                    <p className="wish__msg">{w.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Music toggle ── */}
        <MusicToggle src={d.music || '/templates/mangal/Made In Heaven.mp3'} volume={0.55} startTime={5} opened={opened} />

      </div>
    </InvitationLayoutProvider>
  )
}
