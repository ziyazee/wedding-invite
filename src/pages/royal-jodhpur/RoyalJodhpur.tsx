import { useEffect, useRef } from 'react'
import type { ComponentProps } from 'react'
import type { Celebration, InvitationData } from '../../invitations/model'
// model.ts does not export these helpers; define locally

import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection as Section } from '../../invitations/components/InvitationSection'
import { useCountdown } from './useCountdown'
import { useRoyalMusic } from './useRoyalMusic'
import { useScrollReveal } from './useScrollReveal'
import { useCustomCursor } from './useCustomCursor'
import { usePreloader } from './usePreloader'
import { use3DTilt } from './use3DTilt'
import { useHeroParallax } from './useHeroParallax'
import { usePetals } from './usePetals'
import { useCanvasConfetti } from './useCanvasConfetti'
import { useCurtainReveal } from './useCurtainReveal'
import { useSvgJourney } from './useSvgJourney'
import { useEventsAutoOpen } from './useEventsAutoOpen'
import './RoyalJodhpur.css'

const A = '/templates/shaadipath-t02/assets/'
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600&family=EB+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Raleway:wght@200;300;400&display=swap'

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t11.${field}`} label={label || field.replaceAll('.', ' · ')}>{children}</EditableText>
}

const EVENT_ICONS: Record<string, string> = {
  mehendi: `${A}icons/icon-mehendi.webp`, mehndi: `${A}icons/icon-mehendi.webp`,
  haldi: `${A}icons/icon-haldi.webp`,
  cocktail: `${A}icons/icon-cocktail.webp`,
  sagan: `${A}icons/icon-sagan.webp`, sagaan: `${A}icons/icon-sagan.webp`,
  shaadi: `${A}icons/icon-shaadi.webp`, wedding: `${A}icons/icon-shaadi.webp`,
  reception: `${A}icons/icon-reception.webp`,
}
function evIcon(title: string) { return EVENT_ICONS[title.toLowerCase().trim()] || EVENT_ICONS.shaadi }

const DEMO: InvitationData = {
  template: 11, groom: 'Arjun', bride: 'Priya',
  date: '2026-12-12', time: '00:00', offset: '+05:30',
  venue: 'Umaid Bhawan Palace, Jodhpur', address: 'Jodhpur, Rajasthan', map: '',
  message: '', groomFamily: 'Mr. Ramesh Kapoor & Mrs. Kavita Kapoor',
  brideFamily: 'Mr. Suresh Sharma & Mrs. Sunita Sharma',
  dressCode: 'Indian Festive', giftNote: '',
  music: '/audios/template02.mp3', gallery: '',
  events: [
    { title: 'Mehendi', date: '2026-12-11', time: '14:00', venue: 'Garden Pavilion', address: '', map: '' },
    { title: 'Haldi', date: '2026-12-11', time: '10:00', venue: 'Crystal Hall', address: '', map: '' },
    { title: 'Cocktail', date: '2026-12-11', time: '19:30', venue: 'Zenana Courtyard', address: '', map: '' },
    { title: 'Sagan', date: '2026-12-13', time: '17:00', venue: 'Crystal Hall', address: '', map: '' },
    { title: 'Shaadi', date: '2026-12-14', time: '10:00', venue: 'Grand Darbar Hall', address: '', map: '' },
    { title: 'Reception', date: '2026-12-12', time: '19:00', venue: 'Grand Terrace', address: '', map: '' },
  ],
}

function weddingISO(d: InvitationData) {
  return `${d.date}T${d.time || '00:00'}:00${d.offset || '+05:30'}`
}
function fmtLong(dateStr: string) {
  try { return new Date(dateStr + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return dateStr || '' }
}
function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 || 12
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}
function fmtEvDate(ev: Celebration) {
  const d = new Date(ev.date + 'T00:00')
  const day = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  const t = ev.time ? fmtTime(ev.time) : ''
  return t ? `${day} · ${t}` : day
}

export default function RoyalJodhpur({ details: d = DEMO, rsvpTarget }: { details?: InvitationData; rsvpTarget?: RsvpTarget }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const heroWrapRef = useRef<HTMLDivElement>(null)
  const heroPinRef = useRef<HTMLDivElement>(null)

  const { plRef, plClass, hidden: plHidden, heroReady } = usePreloader()
  const { ringRef, dotRef } = useCustomCursor(rootRef)
  const { playing, toggle: toggleMusic } = useRoyalMusic(d.music)
  const cd = useCountdown(weddingISO(d))

  useHeroParallax(heroWrapRef, heroPinRef, heroReady)
  useScrollReveal(rootRef)
  usePetals(rootRef)
  useCanvasConfetti(rootRef)
  useCurtainReveal(rootRef)
  useSvgJourney(rootRef)
  useEventsAutoOpen(rootRef)
  use3DTilt(rootRef)

  useEffect(() => {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = FONTS_URL; document.head.appendChild(link)
    const p1 = document.createElement('link'); p1.rel = 'preconnect'; p1.href = 'https://fonts.googleapis.com'; document.head.appendChild(p1)
    const p2 = document.createElement('link'); p2.rel = 'preconnect'; p2.href = 'https://fonts.gstatic.com'; p2.crossOrigin = 'anonymous'; document.head.appendChild(p2)
    return () => { link.remove(); p1.remove(); p2.remove() }
  }, [])
  useEffect(() => { document.title = `${d.bride} & ${d.groom} · Wedding Invitation` }, [d.bride, d.groom])

  const events = d.events?.length ? d.events : DEMO.events!
  const hashtag = `#${d.bride}Weds${d.groom}`
  const galleryUrls = d.gallery ? d.gallery.split(',').map(u => u.trim()).filter(Boolean) : []
  const initials = `${d.bride?.[0] || 'B'}&${d.groom?.[0] || 'G'}`
  const evRows = events.length <= 3 ? [events] : [events.slice(0, 3), events.slice(3)]
  const heroIdx = events.findIndex(e => /shaadi|wedding/i.test(e.title))

  return (
    <InvitationLayoutProvider layout={d.textOverrides} manualLayout={d.textOverrides ?? null}>
    <div ref={rootRef} className={`royal-native${heroReady ? '' : ' pl-active'}`}>
      <div ref={ringRef} className="c-ring" />
      <div ref={dotRef} className="c-dot" />

      <button className={`music-btn${playing ? ' playing' : ''}`} onClick={toggleMusic} aria-label="Toggle music">
        {playing ? '🔔' : '🔕'}
      </button>

      {/* PRELOADER */}
      {!plHidden && (
        <div ref={plRef} className={plClass}>
          <div className="pl-bg" />
          <div className="pl-content">
            <div className="pl-mandala-wrap" aria-hidden="true">
              <svg className="pl-mandala" viewBox="0 0 120 120" width="86" height="86">
                <circle className="pl-m-ring pl-m-r1" cx="60" cy="60" r="52" fill="none" stroke="#C8860A" strokeWidth="0.9" />
                <circle className="pl-m-ring pl-m-r2" cx="60" cy="60" r="38" fill="none" stroke="#C8860A" strokeWidth="0.7" />
                <circle className="pl-m-ring pl-m-r3" cx="60" cy="60" r="22" fill="none" stroke="#C8860A" strokeWidth="0.5" />
                <g className="pl-m-petals">
                  {[0,45,90,135,180,225,270,315].map(r => (
                    <ellipse key={r} cx="60" cy="18" rx="5" ry="13" fill="#C8860A" opacity="0.22" transform={`rotate(${r} 60 60)`} />
                  ))}
                </g>
                <circle className="pl-m-dot" cx="60" cy="60" r="4" fill="#C8860A" />
              </svg>
            </div>
            <div className="pl-names">
              <span className="pl-n1">{d.bride}</span>
              <span className="pl-weds">weds</span>
              <span className="pl-n2">{d.groom}</span>
            </div>
          </div>
        </div>
      )}

      {/* HERO SCROLL SCENE */}
      <div id="heroWrap" ref={heroWrapRef} className="hero-wrap">
        <div id="heroPin" ref={heroPinRef} className="hero-pin">
          <div className="hero-sky" />
          <div className="hero-moon" id="heroMoon" />
          <img className="hl hl-palace" src={`${A}layers/Herp Palace.webp`} alt="" />
          <div className="hero-floats" aria-hidden="true">
            <img className="fl diya-l" src={`${A}elements/Element 1.webp`} alt="" />
            <img className="fl diya-r" src={`${A}elements/Element 1.webp`} alt="" />
            <img className="fl fall-l" src={`${A}elements/Element 4.webp`} alt="" />
            <img className="fl fall-r" src={`${A}elements/Element 5.webp`} alt="" />
          </div>
          <div id="petalHero" className="petal-canvas" />
          <div className="rangoli-orb" style={{ top: '22%', left: '6%', animationDelay: '0s' }} aria-hidden="true" />
          <div className="rangoli-orb" style={{ top: '58%', right: '10%', animationDelay: '5s' }} aria-hidden="true" />
          <div className="hero-copy" id="heroCopy">
            <h1 className="hc-bride"><Copy field="hero.bride">{d.bride}</Copy></h1>
            <span className="hc-weds">weds</span>
            <h1 className="hc-groom"><Copy field="hero.groom">{d.groom}</Copy></h1>
            <div className="hc-countdown" aria-label="Countdown to the wedding">
              {cd ? <>
                <span className="hc-cd-unit"><span className="hc-cd-num">{cd.days}</span><span className="hc-cd-label">Days</span></span>
                <span className="hc-cd-sep">·</span>
                <span className="hc-cd-unit"><span className="hc-cd-num">{cd.hours}</span><span className="hc-cd-label">Hrs</span></span>
                <span className="hc-cd-sep">·</span>
                <span className="hc-cd-unit"><span className="hc-cd-num">{cd.mins}</span><span className="hc-cd-label">Min</span></span>
                <span className="hc-cd-sep">·</span>
                <span className="hc-cd-unit"><span className="hc-cd-num">{cd.secs}</span><span className="hc-cd-label">Sec</span></span>
              </> : (
                <span className="hc-cd-unit"><span className="hc-cd-num" style={{ fontSize: 'clamp(.65rem,1.6vw,1rem)', color: 'var(--gold)' }}>We're Married ♥</span></span>
              )}
            </div>
          </div>
          <div className="scroll-nudge" id="scrollNudge">
            <span>Scroll</span>
            <div className="sn-line"><div className="sn-dot" /></div>
          </div>
        </div>
      </div>

      {/* ELEPHANT BRIDGE */}
      <div className="eleph-bridge" id="elephBridge" aria-hidden="true">
        <div className="eleph eleph-l" id="elephL">
          <img src={`${A}elements/Elephant_L.webp`} alt="" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; const svg = (e.target as HTMLImageElement).nextElementSibling as HTMLElement; if (svg) svg.style.display = 'block' }} />
          <ElephantSvg />
          <canvas className="confetti-canvas" id="confettiL" />
        </div>
        <div className="eleph eleph-r" id="elephR">
          <img src={`${A}elements/Elephant_R.webp`} alt="" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; const svg = (e.target as HTMLImageElement).nextElementSibling as HTMLElement; if (svg) svg.style.display = 'block' }} />
          <ElephantSvg mirror />
          <canvas className="confetti-canvas" id="confettiR" />
        </div>
        <canvas className="confetti-rain" id="confettiRain" />
      </div>

      {/* INVITATION */}
      <Section data-invite-section="invite" className="s-invite" id="invite">
        <img className="bg-fill" src={`${A}backgrounds/Background 6.webp`} alt="" />
        <img className="invite-couple-bg" src={`${A}layers/Hero couple.webp`} alt="" aria-hidden="true" />
        <Toran />
        <img className="fl-moon" src={`${A}elements/Element 3.webp`} alt="" aria-hidden="true" />
        <img className="fl-leaf-l" src={`${A}elements/Element 4.webp`} alt="" aria-hidden="true" />
        <img className="fl-leaf-r" src={`${A}elements/Element 5.webp`} alt="" aria-hidden="true" />
        <div className="container">
          <div className="invite-card scroll-in">
            <CardCorner side="tl" /><CardCorner side="tr" />
            <div className="i-ganesha"><img src={`${A}elements/Element 6.webp`} alt="Ganesha" className="i-ganesha-img" /></div>
            <RuleSvg />
            <p className="i-bless"><Copy field="invite.blessing">With the blessings of the divine<br />and the love of our families</Copy></p>
            <p className="i-label"><Copy field="invite.label">Together we invite you to celebrate</Copy></p>
            <div className="i-names">
              <span className="i-bride"><Copy field="invite.bride">{d.bride}</Copy></span>
              <span className="i-amp">&amp;</span>
              <span className="i-groom"><Copy field="invite.groom">{d.groom}</Copy></span>
            </div>
            <RuleSvg />
            <div className="i-fam">
              <div className="fam-side">
                <div className="fam-parents"><em>Daughter of</em><br /><Copy field="invite.brideParents">{d.brideFamily || 'Mr. & Mrs. Sharma'}</Copy></div>
              </div>
              <div className="fam-dot">✦</div>
              <div className="fam-side">
                <div className="fam-parents"><em>Son of</em><br /><Copy field="invite.groomParents">{d.groomFamily || 'Mr. & Mrs. Kapoor'}</Copy></div>
              </div>
            </div>
            <p className="i-close"><Copy field="invite.close">On the following auspicious occasions</Copy></p>
          </div>
        </div>
        <div id="petalInvite" className="petal-canvas" />
      </Section>

      {/* Wave divider */}
      <div className="wdiv"><svg viewBox="0 0 1440 55" preserveAspectRatio="none"><path d="M0,28 C360,55 720,0 1080,28 C1260,40 1440,15 1440,28 L1440,55 L0,55Z" fill="#0D1B3E" /></svg></div>

      {/* EVENTS */}
      <Section data-invite-section="events" className="s-events" id="events">
        <img className="bg-fill" src={`${A}backgrounds/Background 3.webp`} alt="" />
        <div className="ev-paper-veil" />
        <img className="fl-leaf-l" src={`${A}elements/Element 4.webp`} alt="" aria-hidden="true" />
        <img className="fl-leaf-r" src={`${A}elements/Element 5.webp`} alt="" aria-hidden="true" />
        <div className="container">
          <div className="s-head scroll-in">
            <span className="sh-eye"><Copy field="events.eyebrow">The Celebrations</Copy></span>
            <h2 className="sh-h"><Copy field="events.title">Our <em>Events</em></Copy></h2>
          </div>
          <div className="ev-journey-wrap" aria-hidden="true">
            <svg className="ev-journey-svg" id="evJourneySvg" preserveAspectRatio="none">
              <path className="ej-track" id="ejTrack" fill="none" />
              <path className="ej-drawn" id="ejDrawn" fill="none" />
            </svg>
          </div>
          <div className="ev-float-stage" id="evStage" style={{ '--ev-cols': Math.min(events.length, 3) } as React.CSSProperties}>
            {events.map((ev, i) => {
              const row = i < 3 ? 'ev-row1' : 'ev-row2'
              const isHero = i === heroIdx || (heroIdx < 0 && i === events.length - 1)
              return (
                <article key={ev.id || i} className={`ev-node ${row}${isHero ? ' ev-node--hero' : ''} scroll-in`} style={{ '--sd': `${(i % 3) * 0.1 + 0.05}s` } as React.CSSProperties} data-idx={i}>
                  <div className="ev-icon-wrap">
                    <img src={evIcon(ev.title)} alt={ev.title} className="ev-icon" loading="lazy" />
                    <div className="ev-glow" />
                  </div>
                  <div className="ev-label">
                    <span className="ev-name">{ev.title}</span>
                    <span className="ev-date">{fmtEvDate(ev)}</span>
                  </div>
                  <div className="ev-detail">
                    <p className="ev-venue">{ev.venue}</p>
                    {ev.address && <p className="ev-desc">{ev.address}</p>}
                    {ev.map && <a className="ev-map" href={ev.map} target="_blank" rel="noopener noreferrer">View on Map</a>}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
        <div id="petalEvents" className="petal-canvas" />
      </Section>

      {/* Leaf divider */}
      <div className="leaf-div"><svg viewBox="0 0 800 48" width="100%" preserveAspectRatio="xMidYMid meet"><path d="M400,24 Q280,4 160,18 Q80,28 0,22" fill="none" stroke="#6B8E7A" strokeWidth="0.9" opacity="0.5" /><path d="M400,24 Q520,4 640,18 Q720,28 800,22" fill="none" stroke="#6B8E7A" strokeWidth="0.9" opacity="0.5" /><ellipse cx="310" cy="15" rx="13" ry="6" fill="#6B8E7A" opacity="0.35" transform="rotate(-22 310 15)" /><ellipse cx="230" cy="20" rx="11" ry="5" fill="#6B8E7A" opacity="0.30" transform="rotate(-32 230 20)" /><ellipse cx="490" cy="15" rx="13" ry="6" fill="#6B8E7A" opacity="0.35" transform="rotate(22 490 15)" /><ellipse cx="570" cy="20" rx="11" ry="5" fill="#6B8E7A" opacity="0.30" transform="rotate(32 570 20)" /><circle cx="400" cy="24" r="3" fill="#C8860A" opacity="0.6" /></svg></div>

      {/* STORY */}
      <Section data-invite-section="story" className="s-story" id="story">
        <div className="st-paper-bg" />
        <div id="petalStory" className="petal-canvas" style={{ zIndex: 8 }} />
        <div className="st-stage" id="stStage">
          <div className="st-reveal" id="stReveal">
            <StoryMandala />
            <div className="st-rv-inner">
              <div className="st-rv-header">
                <span className="sh-eye"><Copy field="story.eyebrow">Our Journey</Copy></span>
                <h2 className="sh-h"><Copy field="story.title">Meet the <em>Couple</em></Copy></h2>
              </div>
              <div className="st-rv-names">
                <span className="st-rv-bride"><Copy field="story.bride">{d.bride}</Copy></span>
                <span className="st-rv-amp">&amp;</span>
                <span className="st-rv-groom"><Copy field="story.groom">{d.groom}</Copy></span>
              </div>
              <p className="st-rv-verse"><Copy field="story.verse">Two souls, one chai stall, a lifetime of mornings.</Copy></p>
              <div className="st-rv-tags">
                <span className="st-rv-tag">Hopeless romantics</span>
                <span className="st-rv-tag">Chai addicts</span>
                <span className="st-rv-tag">Jodhpur dreamers</span>
                <span className="st-rv-tag">Forever &amp; always</span>
              </div>
            </div>
            <div className="st-petals" id="stPetals" />
          </div>
          <div className="st-char st-bride" id="stBride">
            <img src={`${A}elements/Element_Bride.webp`} alt="Bride" className="st-char-img" loading="lazy" />
          </div>
          <div className="st-char st-groom" id="stGroom">
            <img src={`${A}elements/Element_Groom.webp`} alt="Groom" className="st-char-img" loading="lazy" />
          </div>
          <div className="st-curtains" id="stCurtains">
            <div className="st-curt st-curt-l" id="stCurtL">
              <img src={`${A}elements/Element_Curtain.webp`} alt="" className="st-curt-img" loading="lazy" />
              <div className="st-curt-shadow st-curt-shadow-l" />
            </div>
            <div className="st-curt st-curt-r" id="stCurtR">
              <img src={`${A}elements/Element_Curtain.webp`} alt="" className="st-curt-img st-curt-img-mirror" loading="lazy" />
              <div className="st-curt-shadow st-curt-shadow-r" />
            </div>
          </div>
        </div>
      </Section>

      {/* Diya garland divider */}
      <div className="diya-div"><DiyaGarland /></div>

      {/* GALLERY */}
      <Section data-invite-section="gallery" className="s-gallery" id="gallery">
        <img className="bg-fill" src={`${A}backgrounds/Background 6.webp`} alt="" loading="lazy" />
        <div id="petalGallery" className="petal-canvas" />
        <div className="container">
          <div className="s-head scroll-in">
            <span className="sh-eye"><Copy field="gallery.eyebrow">Moments</Copy></span>
            <h2 className="sh-h"><Copy field="gallery.title">Our <em>Gallery</em></Copy></h2>
          </div>
          <div className="gal-grid">
            {[0,1,2,3].map(i => {
              const url = galleryUrls[i]
              return (
                <div key={i} className={`gal-item${i === 0 ? ' gal-tall' : ''} scroll-in`} style={{ '--sd': `${i * 0.08}s` } as React.CSSProperties}>
                  {url ? <img src={url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div className="gal-ph"><span className="gal-m">{initials}</span><span className="gal-s">Your photo</span></div>}
                </div>
              )
            })}
          </div>
        </div>
      </Section>

      {/* THINGS TO KNOW */}
      <Section data-invite-section="things" className="s-things" id="things">
        <img className="bg-fill things-sky" src={`${A}layers/Hero background.webp`} alt="" />
        <div className="things-veil" />
        <div id="petalThings" className="petal-canvas" />
        <div className="container">
          <div className="s-head scroll-in">
            <span className="sh-eye sh-eye--lt"><Copy field="things.eyebrow">Good to Know</Copy></span>
            <h2 className="sh-h sh-h--lt"><Copy field="things.title">Things to <em>Know</em></Copy></h2>
          </div>
          <div className="tt-row">
            <div className="tt scroll-in" style={{ '--sd': '0s' } as React.CSSProperties}>
              <svg className="tt-ic" viewBox="0 0 32 32" width="38" height="38" fill="none" stroke="#C8860A" strokeWidth="1.3" strokeLinecap="round"><line x1="7" y1="12" x2="25" y2="12" /><line x1="7" y1="20" x2="25" y2="20" /><line x1="13" y1="6" x2="11" y2="26" /><line x1="21" y1="6" x2="19" y2="26" /></svg>
              <span className="tt-l">Hashtag</span><p className="tt-v"><Copy field="things.hashtag">{hashtag}</Copy></p>
            </div>
            <div className="tt scroll-in" style={{ '--sd': '0.1s' } as React.CSSProperties}>
              <svg className="tt-ic" viewBox="0 0 32 32" width="38" height="38" fill="none" stroke="#C8860A" strokeWidth="1.3" strokeLinecap="round"><path d="M16 7a3 3 0 0 1 3 3" /><path d="M5 23 L16 11 L27 23 Q28 25 26 26 L6 26 Q4 25 5 23Z" /></svg>
              <span className="tt-l">Dress Code</span><p className="tt-v"><Copy field="things.dressCode">{d.dressCode || 'Indian Festive'}</Copy></p>
            </div>
            <div className="tt scroll-in" style={{ '--sd': '0.2s' } as React.CSSProperties}>
              <svg className="tt-ic" viewBox="0 0 32 32" width="38" height="38" fill="none" stroke="#C8860A" strokeWidth="1.3" strokeLinecap="round"><path d="M16 3a10 10 0 0 1 10 10c0 9-10 18-10 18S6 22 6 13A10 10 0 0 1 16 3z" /><circle cx="16" cy="13" r="3.5" /></svg>
              <span className="tt-l">Venue</span><p className="tt-v"><Copy field="things.venue">{d.venue ? d.venue.replace(/, /g, '\n') : 'Venue'}</Copy></p>
            </div>
            <div className="tt scroll-in" style={{ '--sd': '0.3s' } as React.CSSProperties}>
              <svg className="tt-ic" viewBox="0 0 32 32" width="38" height="38" fill="none" stroke="#C8860A" strokeWidth="1.3" strokeLinecap="round"><circle cx="16" cy="16" r="12" /><path d="M16 10v6l4 3" /></svg>
              <span className="tt-l">Parking</span><p className="tt-v">Available<br />on-site</p>
            </div>
          </div>
          <div className="tt-ig scroll-in"><span>Follow our story</span><a href="#">{hashtag}</a></div>
        </div>
      </Section>

      {/* Wave up into RSVP */}
      <div className="wdiv wdiv--up"><svg viewBox="0 0 1440 65" preserveAspectRatio="none"><path d="M0,33 C360,0 720,65 1080,33 C1260,16 1440,50 1440,33 L1440,65 L0,65Z" fill="#FAF4E4" /></svg></div>

      {/* RSVP */}
      <Section data-invite-section="rsvp" className="s-rsvp" id="rsvp">
        <div className="rsvp-paper-veil" />
        <RsvpFlorals />
        <img className="s-diya-l" src={`${A}elements/Element 1.webp`} alt="" aria-hidden="true" />
        <img className="s-diya-r" src={`${A}elements/Element 1.webp`} alt="" aria-hidden="true" />
        <div className="rsvp-toran" aria-hidden="true">
          <img src={`${A}backgrounds/Background 4.webp`} alt="" className="toran-img" />
        </div>
        <div id="petalRsvp" className="petal-canvas" />
        <div className="container rsvp-body">
          <div className="rsvp-rule scroll-in"><RsvpRuleSvg /></div>
          <span className="rsvp-eye scroll-in" style={{ '--sd': '.05s' } as React.CSSProperties}><Copy field="rsvp.eyebrow">Join the Celebration</Copy></span>
          <h2 className="rsvp-heading scroll-in" style={{ '--sd': '.12s' } as React.CSSProperties}><Copy field="rsvp.heading">Will you <em>join us?</em></Copy></h2>
          <p className="rsvp-sub scroll-in" style={{ '--sd': '.22s' } as React.CSSProperties}>
            <Copy field="rsvp.subtext">We've saved a seat for you — at our table, in our hearts, and under the royal sky.<br />Come celebrate with us as we begin this new chapter together.</Copy>
          </p>
          <div className="rsvp-cta-wrap scroll-in" style={{ '--sd': '.34s' } as React.CSSProperties}>
            <a className="rsvp-wa-btn" href={`https://wa.me/?text=${encodeURIComponent(`Hi ${d.bride} & ${d.groom}! I would love to join your celebration!`)}`} target="_blank" rel="noopener noreferrer" aria-label="RSVP via WhatsApp">
              <span className="rsvp-wa-shimmer" />
              <span className="rsvp-wa-inner">
                <svg className="rsvp-wa-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.121 1.527 5.855L0 24l6.306-1.506A11.951 11.951 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.003-1.37l-.359-.214-3.737.892.93-3.63-.235-.373A9.818 9.818 0 1112 21.818z" />
                </svg>
                <Copy field="rsvp.btnText">Yes, I'll be there ✨</Copy>
              </span>
            </a>
          </div>
          <p className="rsvp-ps scroll-in" style={{ '--sd': '.44s' } as React.CSSProperties}>You'll be redirected to WhatsApp to confirm your attendance.</p>
          <div className="rsvp-rule scroll-in" style={{ '--sd': '.5s' } as React.CSSProperties}><RsvpRuleSvg /></div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="footer">
        <svg className="ft-lotus" viewBox="0 0 80 40" width="70" aria-hidden="true">
          {[-40,-20,0,20,40].map(r => <ellipse key={r} cx="40" cy="34" rx="7" ry="11" fill="#C8860A" opacity="0.22" transform={`rotate(${r} 40 34)`} />)}
          <circle cx="40" cy="34" r="5" fill="#C8860A" opacity="0.48" />
        </svg>
        <div className="ft-names"><Copy field="footer.names">{d.bride} &amp; {d.groom}</Copy></div>
        <div className="ft-rule" />
        <p className="ft-date"><Copy field="footer.date">{fmtLong(d.date)}{d.venue ? ` · ${d.venue}` : ''}</Copy></p>
        <p className="ft-credit">A beautiful wedding invitation</p>
      </footer>
    </div>
    </InvitationLayoutProvider>
  )
}

/* ── Inline SVG sub-components ── */

function ElephantSvg({ mirror }: { mirror?: boolean }) {
  return (
    <svg className="eleph-svg" viewBox="0 0 220 320" style={{ display: 'none', ...(mirror ? { transform: 'scaleX(-1)' } : {}) }}>
      <ellipse cx="110" cy="200" rx="90" ry="80" fill="#1A2C5B" opacity="0.9" />
      <ellipse cx="155" cy="130" rx="55" ry="50" fill="#1A2C5B" opacity="0.9" />
      <ellipse cx="110" cy="125" rx="38" ry="42" fill="#0D1B3E" opacity="0.8" />
      <path d="M175,110 Q195,70 210,40 Q215,20 205,10 Q195,5 188,15 Q180,30 175,55 Q165,85 160,110Z" fill="#1A2C5B" opacity="0.9" />
      <ellipse cx="205" cy="10" rx="8" ry="6" fill="#0D1B3E" opacity="0.9" />
      <circle cx="162" cy="118" r="5" fill="#F0E0B0" opacity="0.8" />
      <circle cx="163" cy="117" r="2" fill="#FAF4E4" />
      <path d="M172,145 Q185,155 180,168" fill="none" stroke="#F0E0B0" strokeWidth="4" strokeLinecap="round" />
      <path d="M55,165 Q110,140 165,165 Q170,195 165,220 Q110,235 55,220 Z" fill="#A01830" opacity="0.75" />
      <path d="M55,165 Q110,140 165,165 Q170,195 165,220 Q110,235 55,220 Z" fill="none" stroke="#C8860A" strokeWidth="2" opacity="0.6" />
      <circle cx="110" cy="190" r="10" fill="#C8860A" opacity="0.8" />
      <circle cx="110" cy="190" r="6" fill="#F0E0B0" opacity="0.9" />
      <rect x="65" y="265" width="30" height="50" rx="12" fill="#0D1B3E" opacity="0.85" />
      <rect x="105" y="265" width="30" height="50" rx="12" fill="#0D1B3E" opacity="0.85" />
      <rect x="130" y="262" width="30" height="48" rx="12" fill="#0D1B3E" opacity="0.85" />
      <rect x="63" y="300" width="34" height="6" rx="3" fill="#C8860A" opacity="0.7" />
      <rect x="103" y="300" width="34" height="6" rx="3" fill="#C8860A" opacity="0.7" />
      <path d="M28,200 Q15,230 22,255 Q28,268 35,262" fill="none" stroke="#0D1B3E" strokeWidth="5" strokeLinecap="round" />
    </svg>
  )
}

function Toran() {
  return (
    <div className="toran" aria-hidden="true">
      <svg viewBox="0 0 1200 120" width="100%" preserveAspectRatio="xMidYMax meet" style={{ display: 'block' }}>
        <path d="M0,18 Q300,8 600,18 Q900,28 1200,18" fill="none" stroke="#C8860A" strokeWidth="1.2" opacity="0.60" />
        {[[60,18],[240,20],[440,16],[600,10],[760,16],[960,20],[1140,18]].map(([x,y],i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <line x1="0" y1="0" x2="0" y2={y < 18 ? 22 : 18} stroke="#C8860A" strokeWidth={i%2===0?'0.8':'1.0'} opacity={i%2===0?'0.55':'0.65'} />
            <ellipse cx="0" cy={y < 18 ? 27 : 22} rx={i%3===2?13:i%2===0?10:11} ry={i%3===2?5:4} fill="#C8860A" opacity={i%3===2?'0.60':'0.55'} />
            <path d={`M-${i%3===2?11:8},${y < 18 ? 27 : 22} Q0,${y < 18 ? 52 : 42} ${i%3===2?11:8},${y < 18 ? 27 : 22}Z`} fill="#A01830" opacity={i%3===2?'0.85':'0.80'} />
            <ellipse cx="0" cy={y < 18 ? 25 : 20} rx={i%3===2?9:7} ry="3" fill="#C8860A" opacity="0.65" />
            <path d={`M0,${y < 18 ? 17 : 14} Q${i%3===2?2:1.5},${y < 18 ? 9 : 8} 0,${y < 18 ? 17 : 14}`} fill="#F0E0B0" opacity="0.90" />
          </g>
        ))}
        {[[150,14],[330,12],[870,12],[1050,14]].map(([x,y],i) => (
          <g key={`b${i}`} transform={`translate(${x},${y})`}>
            <line x1="0" y1="0" x2="0" y2={y} stroke="#C8860A" strokeWidth="0.7" opacity="0.45" />
            <circle cx="0" cy={y+6} r={y===14?9:8} fill="#C8860A" opacity={y===14?'0.30':'0.28'} />
            <circle cx="0" cy={y+6} r={y===14?6:5.5} fill="#C8860A" opacity={y===14?'0.55':'0.50'} />
            <circle cx="0" cy={y+6} r={y===14?3:2.5} fill="#F0E0B0" opacity={y===14?'0.70':'0.65'} />
          </g>
        ))}
        {[200,500,700,1000].map(x => <circle key={x} cx={x} cy={x<600?18:16} r="2" fill="#C8860A" opacity="0.35" />)}
      </svg>
    </div>
  )
}

function CardCorner({ side }: { side: 'tl' | 'tr' }) {
  const d = side === 'tl' ? 'M8,42 Q25,-5 45,12 Q58,28 32,40Z' : 'M42,42 Q25,-5 5,12 Q-8,28 18,40Z'
  return <div className={`card-${side}`}><svg viewBox="0 0 50 50" width="50"><path d={d} fill="none" stroke="#C8860A" strokeWidth="0.8" opacity="0.45" /></svg></div>
}

function RuleSvg() {
  return (
    <div className="i-rule"><svg viewBox="0 0 300 8" width="100%" style={{ maxWidth: 300 }}><line x1="0" y1="4" x2="128" y2="4" stroke="#C8860A" strokeWidth="0.8" opacity="0.50" /><polygon points="150,1 160,4 150,7 140,4" fill="#C8860A" opacity="0.85" /><line x1="172" y1="4" x2="300" y2="4" stroke="#C8860A" strokeWidth="0.8" opacity="0.50" /></svg></div>
  )
}

function StoryMandala() {
  return (
    <div className="st-mandala" aria-hidden="true">
      <svg viewBox="0 0 320 320" width="320" height="320">
        <circle cx="160" cy="160" r="130" fill="none" stroke="rgba(200,134,10,.12)" strokeWidth="1" />
        <circle cx="160" cy="160" r="100" fill="none" stroke="rgba(200,134,10,.09)" strokeWidth="0.8" />
        <circle cx="160" cy="160" r="70" fill="none" stroke="rgba(200,134,10,.07)" strokeWidth="0.6" />
        <g opacity=".14">{[0,45,90,135,180,225,270,315].map(r => <ellipse key={r} cx="160" cy="60" rx="10" ry="28" fill="#C8860A" transform={`rotate(${r} 160 160)`} />)}</g>
        <circle cx="160" cy="160" r="18" fill="rgba(200,134,10,.08)" />
      </svg>
    </div>
  )
}

function DiyaGarland() {
  const xs = [55,135,215,300,385,465,545]
  return (
    <svg viewBox="0 0 600 56" width="100%" preserveAspectRatio="xMidYMid meet">
      <path d="M0,16 Q150,6 300,16 Q450,26 600,16" fill="none" stroke="#C8860A" strokeWidth="0.8" opacity="0.40" />
      {xs.map((x, i) => {
        const y = [16,12,19,16,20,14,16][i]
        const isCentral = i === 3
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <line x1="0" y1="0" x2="0" y2="7" stroke="#C8860A" strokeWidth="0.5" opacity="0.4" />
            <path d="M-7,7 Q0,20 7,7Z" fill={isCentral ? '#C8860A' : '#A01830'} opacity="0.70" />
            <ellipse cx="0" cy="5.5" rx="5.5" ry="2" fill={isCentral ? '#F0E0B0' : '#C8860A'} opacity="0.60" />
            <path d="M0,3 Q0.8,0 0,3" fill="#F0E0B0" opacity="0.9" />
          </g>
        )
      })}
    </svg>
  )
}

function RsvpFlorals() {
  return (
    <div className="rsvp-florals" aria-hidden="true">
      {['tl','br'].map(pos => (
        <svg key={pos} className={`rsvp-fl rsvp-fl--${pos}`} viewBox="0 0 180 180" fill="none">
          <ellipse cx="60" cy="90" rx="18" ry="42" fill="#A01830" opacity=".07" transform="rotate(-30 60 90)" />
          <ellipse cx="90" cy="55" rx="14" ry="36" fill="#C8860A" opacity=".06" transform="rotate(20 90 55)" />
          <ellipse cx="115" cy="95" rx="16" ry="38" fill="#A01830" opacity=".05" transform="rotate(60 115 95)" />
          <circle cx="88" cy="88" r="6" fill="#C8860A" opacity=".10" />
        </svg>
      ))}
      {['tr','bl'].map(pos => (
        <svg key={pos} className={`rsvp-fl rsvp-fl--${pos}`} viewBox="0 0 120 120" fill="none">
          <ellipse cx="40" cy="60" rx="10" ry="28" fill="#A01830" opacity=".07" transform="rotate(15 40 60)" />
          <ellipse cx="75" cy="45" rx="9" ry="24" fill="#C8860A" opacity=".06" transform="rotate(-40 75 45)" />
        </svg>
      ))}
    </div>
  )
}

function RsvpRuleSvg() {
  return (
    <svg viewBox="0 0 400 12" width="100%" style={{ maxWidth: 400 }}>
      <line x1="0" y1="6" x2="168" y2="6" stroke="#C8860A" strokeWidth="0.8" opacity=".40" />
      <path d="M 184 6 m -8 0 a 8 8 0 1 0 16 0 a 8 8 0 1 0 -16 0" fill="none" stroke="#C8860A" strokeWidth="1" opacity=".60" />
      <line x1="200" y1="6" x2="400" y2="6" stroke="#C8860A" strokeWidth="0.8" opacity=".40" />
    </svg>
  )
}
