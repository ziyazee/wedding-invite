import PersonalMusic from '../invitations/PersonalMusic'
import PersonalNotes from '../invitations/PersonalNotes'
import '../invitations/personalized.css'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './Design2.css'
import './RoyalGrace.css'
import '../invitations/premiumTextMotion.css'
import HeartDateReveal from './HeartDateReveal'
import FlowerTrail from './FlowerTrail'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO } from '../invitations/model'
import { downloadCalendar } from '../invitations/calendar'
import { editableText } from '../invitations/textLayout'
import { EditableText, InvitationLayoutProvider } from '../invitations/components/EditableText'
import { InvitationSection } from '../invitations/components/InvitationSection'
import { InvitationMedia } from '../invitations/components/InvitationMedia'
import { royalGraceBasePlacements } from '../invitations/royalGraceLayout'
import useGoogleFonts from '../hooks/useGoogleFonts'

const LegacyLayoutEditor = lazy(() => import('./InvitationLayoutEditor'))
function CelebrationLayout({ personalized, children }: { personalized: boolean; children: ReactNode }) {
  if (personalized) return <div>{children}</div>
  return <Suspense fallback={<div>{children}</div>}><LegacyLayoutEditor>{children}</LegacyLayoutEditor></Suspense>
}

const ASSETS = '/templates/royal-grace/'
const defaultTextLayout = {
  version: 1 as const,
  elements: {
    't1.opening.heading': { fontSize: 25 },
    't1.opening.date': { fontSize: 13, hidden: true },
    't1.opening.groom': { fontSize: 43 },
    't1.opening.bride': { fontSize: 47 },
    't1.save-date.couple': { x: 0, y: -0.30530511392175463 },
    't1.save-date.heading': { fontSize: 29, x: 0, y: -0.2994218712024698 },
    't1.save-date.scratch': { x: 0, y: -0.3071392635355578 },
    't1.date-reveal.scratchHeading': { fontSize: 35, x: 0, y: 0.0382868599274265 },
    't1.date-reveal.tap': { x: 0, y: -0.0633898504307191 },
    't1.countdown.divider-top': {},
    't1.countdown.caption': {},
    't1.countdown.heading': {},
    't1.countdown.timer': {},
    't1.programme.flower': {},
    't1.programme.caption': {},
    't1.programme.heading': {},
    't1.programme.divider': {},
    't1.event-legacy-1.title': { fontSize: 27 },
    't1.event-legacy-1.calendar': { x: 0.008930616616497676, y: 0.07605396617542613 },
    't1.event-legacy-1.directions': { x: 0.0054560014654626105, y: 0.07718983043323864 },
    't1.notes.familyHeading': { fontSize: 33 },
    't1.notes.groomLabel': { fontSize: 12 },
    't1.notes.brideLabel': { fontSize: 13 },
    't1.notes.groomFamily': { fontSize: 19 },
    't1.notes.brideFamily': { fontSize: 19 },
    't1.closing.heading': { fontSize: 35, x: 0, y: 0.017307720463833 },
    't1.closing.divider': { fontSize: 22 },
    't1.closing.groom': { x: 0, y: -0.06177818406693818 },
    't1.closing.separator': { x: 0, y: -0.06105473645050125 },
    't1.closing.bride': { x: 0, y: -0.06813175516917293 },
    't1.closing.date': { fontSize: 11, x: 0, y: -0.07863632877767335 },
  },
}
const eventDate = new Date('2026-12-20T11:00:00+05:30')
const defaultEvents = [
  { id: 'mehendi', title: 'Mehendi', date: 'Thursday, December 17', iso: '2026-12-17T11:00:00+05:30', time: '11:00 AM', venue: 'Grand Ballroom', address: 'City Centre', map: '' },
  { id: 'nikah', title: 'Nikah & Wedding', date: 'Sunday, December 20', iso: '2026-12-20T11:00:00+05:30', time: '11:00 AM', venue: 'Royal Convention Centre', address: 'Downtown', map: '' },
  { id: 'wedding-reception', title: 'Wedding Reception', date: 'Monday, December 21', iso: '2026-12-21T19:00:00+05:30', time: '7:00 PM', venue: 'Palace Gardens', address: 'Lakeside Road', map: '' },
]

function Divider({ symbol = '✧', textId }: { symbol?: string; textId?: string }) {
  if (textId) return <EditableText as="div" textId={textId} label="Divider" className="rg-divider" aria-hidden="true"><span />{symbol}<span /></EditableText>
  return <div className="rg-divider" aria-hidden="true"><span />{symbol}<span /></div>
}

function CelebrationBotanical({ className = '' }: { className?: string }) {
  return <InvitationMedia className={className} src={`${ASSETS}celebration-roses.webp`} alt="" aria-hidden="true" />
}

function Countdown() {
  const details = useInvitationDetails()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const diff = Math.max(0, (details ? new Date(weddingISO(details)).getTime() : eventDate.getTime()) - now)
  if (!diff) return <p className="rg-script rg-celebrate">A day to remember, a love forever.</p>
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60]
  return <div className="rg-countdown">{values.map((v, i) => <div key={i}><strong>{String(v).padStart(2, '0')}</strong><small>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</small></div>)}</div>
}

export default function RoyalGrace() {
  useGoogleFonts('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600&family=Cinzel:wght@400;500;600&family=Dancing+Script:wght@400;500&display=swap')
  const details = useInvitationDetails()
  const groom = details?.groom || 'Groom'
  const bride = details?.bride || 'Bride'
  const couple = `${groom} & ${bride}`
  const events = details ? [...details.events].sort((a,b)=>`${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`)).map((event,index)=>({
    layoutKey: event.id || `legacy-${details.events.indexOf(event)}`,
    id: event.date === details.date ? 'nikah' : `event-${index}`,
    title:event.title,date:formatDate(event.date,{weekday:'long',month:'long',day:'numeric'}),
    iso:`${event.date}T${event.time || '00:00'}:00${details.offset}`,time:formatTime(event.time),venue:event.venue,address:event.address,map:mapURL(event.venue,event.address===event.venue?'':event.address,event.map),
  })) : defaultEvents.map(event => ({ ...event, layoutKey: event.id }))
  const text = (section: string, field: string, label: string) => editableText(details?.template, section, field, label)
  const basePlacement = (event: (typeof events)[number], field: string) => details && event.id === 'nikah' ? royalGraceBasePlacements[field] : undefined
  const eventText = (event: (typeof events)[number], field: string, label: string) => ({ ...text(`event-${event.layoutKey}`, field, label), baseTransform: basePlacement(event, field) })
  const root = useRef<HTMLElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const isEditor = new URLSearchParams(window.location.search).get('editor') === '1'
  const [opened, setOpened] = useState(isEditor)
  const [namesVisible, setNamesVisible] = useState(isEditor)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoFrameReady, setVideoFrameReady] = useState(false)

  useEffect(() => {
    if (isEditor && video.current) { video.current.currentTime = 1; video.current.play().catch(() => { setVideoFailed(true); setNamesVisible(true) }) }
  }, [isEditor])

  useEffect(() => {
    const previousTitle = document.title
    document.title = `${couple} — Our Wedding`
    return () => { clearTimeout(timer.current); document.title = previousTitle }
  }, [couple])

  useEffect(() => {
    if (!opened || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (new URLSearchParams(window.location.search).get('edit') === '1') return
    const paper = document.getElementById('rg-welcome')
    if (!paper) return
    const elements = paper.querySelectorAll<HTMLElement>([
      '.rg-section > h2', '.rg-section > p', '.rg-signature',
      '.rg-countdown', '.mr-celebration-heading > h2',
      '.mr-celebration-heading > p', '[data-layout-id]',
      '.mr-celebration-close > p', '.mr-gallery > a', '.rg-ending > *',
    ].join(','))
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('mr-scroll-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -20px 0px' })
    elements.forEach(element => {
      element.classList.add('mr-scroll-reveal')
      observer.observe(element)
    })
    return () => {
      observer.disconnect()
      elements.forEach(element => {
        element.classList.remove('mr-scroll-reveal', 'mr-scroll-visible')
      })
    }
  }, [opened])

  function openInvitation() {
    if (opened) return
    setOpened(true)
    if (videoFailed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setNamesVisible(true); return }
    if (video.current) { video.current.currentTime = 1; video.current.play().catch(() => { setVideoFailed(true); setNamesVisible(true) }) }
  }

  useEffect(() => {
    const el = root.current
    if (!el || !opened || isEditor || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    el.classList.add('invite-motion-ready')
    const paper = el.querySelector('#rg-welcome')
    if (!paper) return
    const targets = [...paper.querySelectorAll<HTMLElement>('[data-invite-text]')]
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('invite-motion-visible'); observer.unobserve(entry.target) } })
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' })
    targets.forEach(t => observer.observe(t))
    return () => { observer.disconnect(); targets.forEach(t => t.classList.remove('invite-motion-visible')); el.classList.remove('invite-motion-ready') }
  }, [opened])

  const mergedLayout = {
    version: 1 as const,
    elements: { ...defaultTextLayout.elements, ...details?.textOverrides?.elements },
  }
  return <InvitationLayoutProvider layout={mergedLayout}><main ref={root} className="royal-grace">
    <FlowerTrail />
    <PersonalMusic src={details?.music || "/bisara.mp3"} />
    <InvitationSection data-invite-section="opening" className={`rg-hero ${namesVisible ? 'rg-is-open' : ''}`} style={!namesVisible ? { backgroundImage: `url('${ASSETS}opening-poster.webp')` } : undefined} aria-label="Wedding invitation">
      {!videoFailed && <InvitationMedia kind="video" ref={video} src={`${ASSETS}opening.mp4`} poster={isEditor ? undefined : `${ASSETS}opening-poster.webp`} muted playsInline onPlaying={event => {
        const player = event.currentTarget
        if (isEditor) player.playbackRate = 10
        if (typeof player.requestVideoFrameCallback === 'function') {
          player.requestVideoFrameCallback(() => setVideoFrameReady(true))
        } else {
          requestAnimationFrame(() => requestAnimationFrame(() => setVideoFrameReady(true)))
        }
      }} onError={() => { setVideoFailed(true); if (opened) setNamesVisible(true) }} onTimeUpdate={event => {
        const v = event.currentTarget
        if (v.duration && v.duration - v.currentTime <= (isEditor ? 0.5 : 3)) setNamesVisible(true)
      }} onEnded={() => setNamesVisible(true)} />}
      {!isEditor && <InvitationMedia priority className={`mr-opening-poster ${videoFrameReady || namesVisible ? 'mr-opening-poster-hidden' : ''}`} src={`${ASSETS}opening-poster.webp`} alt="" aria-hidden="true" />}
      <div className="rg-hero-shade" />
      {!opened && <button className="rg-open" onClick={openInvitation} aria-label="Open your invitation" />}
      <div className="rg-names" aria-hidden={!namesVisible}>
        <span className="rg-heart">♥</span><EditableText as="p" {...text('opening','heading',"We're getting married")} className="rg-script">We're getting married</EditableText><EditableText as="p" {...text('opening','date','Wedding date · opening')} className="rg-eyebrow">{details ? formatDate(details.date) : "20 · 12 · 26"}</EditableText><Divider symbol="♥" />
        <h1><EditableText {...text('opening', 'groom', "Groom's name · opening")}>{groom}</EditableText><EditableText as="i" {...text('opening','separator','Ampersand · opening')}>&</EditableText><EditableText {...text('opening', 'bride', "Bride's name · opening")}>{bride}</EditableText></h1>
        <EditableText as="p" {...text('opening','caption','Together, with our families')} className="rg-eyebrow">Together, with our families</EditableText>
      </div>
      {namesVisible && <EditableText as="a" {...text('opening','scroll','Scroll to discover')} className="rg-scroll" href="#rg-welcome" onClick={e => {
        e.preventDefault()
        document.getElementById('rg-welcome')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start',
        })
      }}>SCROLL TO DISCOVER<span>⌄</span></EditableText>}
    </InvitationSection>

    {opened && <div className="rg-paper" id="rg-welcome">
      <InvitationSection data-invite-section="welcome" className="rg-section rg-welcome">
        <EditableText as="p" {...text('welcome','caption','An invitation from the heart')} className="rg-eyebrow">An invitation from the heart</EditableText>
        <Divider symbol="♥" textId="t1.welcome.divider" />
        <EditableText as="h2" {...text('welcome','heading','Two souls. One beautiful journey.')} className="rg-script">Two souls. One beautiful journey.</EditableText>
        <EditableText as="p" {...text('welcome', 'message', 'Welcome message')}>{details?.message || "With the blessings of God and the love of our families, we invite you to celebrate the beginning of our forever."}</EditableText>
        <EditableText as="p" {...text('welcome','blessing','Your presence, your prayers…')}>Your presence, your prayers, and your love will make our day complete.</EditableText>
        {Object.entries(mergedLayout.elements).filter(([id, v]) => id.startsWith('t1.custom.') && !(v as any).hidden && (v as any).content).map(([id]) => <EditableText key={id} as="p" textId={id} label={`Custom text ${id.split('.')[2]}`}>{(mergedLayout.elements as any)[id].content}</EditableText>)}
      </InvitationSection>
      <InvitationSection data-invite-section="save-date" className="rg-section rg-save-date"><EditableText as="div" textId="t1.save-date.couple" label="Couple photo"><InvitationMedia src={`${ASSETS}couple.webp`} alt="" className="rg-couple-photo" aria-hidden="true" /></EditableText><EditableText as="h2" {...text('save-date','heading','Save our date')} className="rg-script">Save our date</EditableText><EditableText as="div" textId="t1.save-date.scratch" label="Scratch card"><HeartDateReveal date={details ? formatDate(details.date) : "20 December 2026"} day={details ? formatDate(details.date,{weekday:"long"}) : "Sunday"} time={details ? formatTime(details.time) : "11:00 in the morning"}  /></EditableText></InvitationSection>
      <PersonalNotes family notes={false} />
      <InvitationSection data-invite-section="countdown" className="rg-section"><Divider textId="t1.countdown.divider-top" /><EditableText as="p" {...text('countdown','caption','Counting down to Nikah & Wedding')} className="rg-eyebrow">Counting down to Nikah & Wedding</EditableText><EditableText as="h2" {...text('countdown','heading','Until our forever')} className="rg-script">Until our forever</EditableText><EditableText as="div" textId="t1.countdown.timer" label="Countdown timer"><Countdown /></EditableText></InvitationSection>
      <InvitationSection data-invite-section="programme" className="rg-section mr-celebrations" aria-labelledby="mr-celebrations-title">
        <InvitationSection as="div" data-invite-section="programme-heading" className="mr-celebration-heading"><EditableText as="div" textId="t1.programme.flower" label="Botanical flower"><CelebrationBotanical className="mr-heading-flower"/></EditableText><EditableText as="p" {...text('programme','caption','Together, in celebration')} className="rg-eyebrow">Together, in celebration</EditableText><EditableText as="h2" {...text('programme','heading','Moments that become memories')} id="mr-celebrations-title" className="rg-script">Moments that<br/>become memories</EditableText><Divider textId="t1.programme.divider" /></InvitationSection>
        <div className="mr-celebration-body">
        <CelebrationLayout personalized={!!details}><div className="mr-events">{events.map(event => <article className={`mr-event ${event.id === 'nikah' ? 'mr-main-event' : ''}`} key={event.layoutKey} aria-labelledby={`mr-title-${event.id}`}>
          <InvitationSection as="div" data-invite-section="celebration" className="mr-event-paper">
          <InvitationMedia className="mr-stationery-art" src={`${ASSETS}${event.id === 'nikah' ? 'sage-stationery-unframed.webp' : 'ivory-stationery-unframed.webp'}`} alt="" aria-hidden="true"/>
          <div className="mr-event-heading">
            <div className="mr-title-column"><EditableText as="h3" {...eventText(event,'title','Celebration name')} data-layout-id={`${event.id}:title`} id={`mr-title-${event.id}`} className="rg-script">{event.title.split(' — ')[0]}</EditableText></div>
            <EditableText as="time" baseTransform={basePlacement(event,'date')} data-layout-id={`${event.id}:date`} dateTime={event.iso} className="mr-event-date"><EditableText as="strong" {...eventText(event,'day','Celebration date · day')}>{event.iso.slice(8,10)}</EditableText><span><EditableText {...eventText(event,'month','Celebration date · month')} style={{display:'inline-block'}}>{formatDate(event.iso.slice(0,10),{month:"long"})}</EditableText><EditableText as="small" {...eventText(event,'year','Celebration date · year')}>{event.iso.slice(0,4)}</EditableText></span></EditableText>
            <EditableText as="p" {...eventText(event,'weekday','Celebration date · weekday')} data-layout-id={`${event.id}:weekday`} className="mr-weekday">{event.date.split(',')[0]}</EditableText>
            {event.time && <EditableText as="p" {...eventText(event,'time','Celebration time')} data-layout-id={`${event.id}:time`} className="mr-time">{event.time}</EditableText>}
          </div>
          <div className="mr-venue-row"><EditableText as="h4" {...eventText(event,'venue','Celebration venue')} data-layout-id={`${event.id}:venue`}>{event.venue}</EditableText>{event.address!==event.venue&&<EditableText as="p" {...eventText(event,'address','Celebration address')} data-layout-id={`${event.id}:address`} className="mr-address">{event.address}</EditableText>}</div>
          <div className="mr-actions"><EditableText as="a" {...eventText(event,'directions','Directions label')} data-layout-id={`${event.id}:directions`} className="mr-directions" href={event.map} target="_blank" rel="noreferrer" aria-label={`Directions to ${event.venue}`}>Directions <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}><path d="M6 18 18 6M6 6h12v12" /></svg></EditableText><EditableText as="a" {...eventText(event,'calendar','Save the date label')} data-layout-id={`${event.id}:calendar`} className="mr-calendar" onClick={e=>{if(details){e.preventDefault();downloadCalendar({title:event.title,date:event.iso.slice(0,10),time:event.iso.slice(11,16),venue:event.venue,address:event.address,map:event.map},details.offset,couple)}}} href="#" target="_blank" rel="noreferrer" aria-label={`Add ${event.title} to calendar`}>Save the date <span>+</span></EditableText></div>
          </InvitationSection>
        </article>)}</div></CelebrationLayout>
        </div>
      </InvitationSection>
      {!details && <InvitationSection data-invite-section="gallery" className="rg-section mr-gallery"><Divider textId="t1.gallery.divider-top" /><p className="rg-eyebrow">Captured with love</p><h2 className="rg-script">Every moment, held close.</h2><p>Visit the gallery as the celebration unfolds and relive the memories with us.</p><Divider textId="t1.gallery.divider-bottom" /></InvitationSection>}
      <PersonalNotes family={false}/>
      <InvitationSection as="footer" data-invite-section="closing" className="rg-ending"><EditableText as="p" {...text('closing','caption','Made with love for our family and friends')} className="rg-eyebrow">Made with love for our family and friends</EditableText><EditableText as="h2" {...text('closing','heading','Forever & ever')} className="rg-script">Forever & ever</EditableText><Divider textId="t1.closing.divider" /><span className="rg-script"><EditableText {...text('closing','groom',"Groom's name · closing")} style={{display:'block'}}>{groom}</EditableText><EditableText {...text('closing','separator','Ampersand · closing')} style={{display:'block'}}>&amp;</EditableText><EditableText {...text('closing','bride',"Bride's name · closing")} style={{display:'block'}}>{bride}</EditableText></span><EditableText as="p" {...text('closing','date','Wedding date · closing')} className="rg-eyebrow">{details ? formatDate(details.date) : "20 · 12 · 26"}</EditableText></InvitationSection>
    </div>}
  </main></InvitationLayoutProvider>
}
