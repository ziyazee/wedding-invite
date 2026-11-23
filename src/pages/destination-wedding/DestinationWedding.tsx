import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import type { InvitationData } from '../../invitations/model'
import { formatDate, weddingISO } from '../../invitations/model'
import type { RsvpTarget } from '../../invitations/rsvp'
import { EditableText, InvitationLayoutProvider } from '../../invitations/components/EditableText'
import { InvitationSection } from '../../invitations/components/InvitationSection'
import { DestinationCelebrationCard } from './DestinationCelebrationCard'
import { useDestinationGate } from './useDestinationGate'
import { useDestinationMusic } from './useDestinationMusic'
import { useDestinationCountdown } from './useDestinationCountdown'
import { useDestinationReveal } from './useDestinationReveal'
import { useDestinationScratch } from './useDestinationScratch'
import { useDestinationCarousel } from './useDestinationCarousel'
import './DestinationWedding.css'

const A = '/templates/destination-wedding/wedding/'
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap'

type CopyProps = Omit<ComponentProps<typeof EditableText>, 'textId'> & { field: string }
function Copy({ field, label, children, ...props }: CopyProps) {
  return <EditableText {...props} textId={`t12.${field}`} label={label || field.replaceAll('.', ' · ')}>{children}</EditableText>
}

const demo: InvitationData = {
  template: 12, groom: 'Kiran', bride: 'Priya', date: '2026-12-15', time: '19:00', offset: '+05:30',
  venue: 'Taj Lake Palace', address: 'Udaipur, Rajasthan, India', map: '',
  message: "Some souls are destined to find each other, no matter how long the journey. Their story wasn't just about falling in love—it was about finding peace in each other's presence, strength in every challenge, and a home in each other's hearts.",
  groomFamily: "Mr. & Mrs. Sharma", brideFamily: "Mr. & Mrs. Patel",
  dressCode: 'Indian Formal', giftNote: '', music: '/templates/destination-wedding/music.mp3', gallery: '',
  events: [
    { title: 'Mehendi', date: '2026-12-14', time: '17:00', venue: 'Taj Lake Palace', address: 'Udaipur, India', map: '' },
    { title: 'Wedding Ceremony', date: '2026-12-15', time: '19:00', venue: 'Taj Lake Palace', address: 'Udaipur, India', map: '' },
  ],
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor" />
      <path d="M12.05 2C6.532 2 2.05 6.478 2.05 11.994c0 1.76.46 3.478 1.336 4.993L2 22l5.233-1.373A9.916 9.916 0 0012.05 22C17.565 22 22.05 17.52 22.05 12.006 22.05 6.49 17.565 2 12.05 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function GaneshaSvg({ className }: { className?: string }) {
  return <img className={className} src={`${A}ganesha.webp`} alt="Lord Ganesha" loading="eager" />
}

function Lantern({ style }: { style: React.CSSProperties }) {
  return <img className="dest-lantern" src={`${A}lantern.webp`} alt="" style={style} />
}

export default function DestinationWedding({ details: d = demo, rsvpTarget }: { details?: InvitationData; rsvpTarget?: RsvpTarget }) {
  const root = useRef<HTMLElement>(null)
  const { phase, enter } = useDestinationGate()
  const music = useDestinationMusic(d.music || `${A}../music.mp3`)
  const targetMs = new Date(weddingISO(d)).getTime()
  const { days, hours, minutes, seconds, passed } = useDestinationCountdown(targetMs)
  useDestinationReveal(root, phase === 'open')
  const { canvasRef, revealed: scratchRevealed } = useDestinationScratch()
  const couplePhotos = [`${A}couple-1.webp`, `${A}couple-2.webp`, `${A}couple-3.webp`, `${A}couple-4.webp`]
  const carousel = useDestinationCarousel(couplePhotos.length, 3500)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONTS_URL
    document.head.appendChild(link)
    return () => { link.remove() }
  }, [])

  function handleEnter() {
    enter()
    music.start()
  }

  const rsvpHref = rsvpTarget
    ? `https://wa.me/?text=${encodeURIComponent(`RSVP for ${d.groom} & ${d.bride}'s wedding`)}`
    : '#'

  return (
    <InvitationLayoutProvider layout={d.textOverrides} manualLayout={d.textOverrides ?? null}>
      <main ref={root} className={`dest dest-${phase}`}>
        {d.music && (
          <audio ref={music.audio} src={d.music} preload="none" loop
            onPlay={() => music.setPlaying(true)} onPause={() => music.setPlaying(false)} />
        )}
        {phase === 'open' && d.music && (
          <button className="dest-music" aria-label={music.playing ? 'Pause music' : 'Play music'}
            onClick={music.toggle}>{music.playing ? 'Ⅱ' : '♫'}</button>
        )}

        {/* ══════ GATE ══════ */}
        <InvitationSection data-invite-section="gate" className="dest-gate">
          <img className="dest-gate-bg" src={`${A}background_gate.webp`} alt="" />
          <div className="dest-gate-content">
            <Lantern style={{ top: '8%', left: '5%' }} />
            <Lantern style={{ top: '12%', right: '8%', width: '48px' }} />
            <GaneshaSvg className="dest-gate-ganesh" />
            <div className="dest-gate-names dest-serif">
              <Copy as="span" field="gate.groom" label="gate · groom name">{d.groom.split(' ')[0]}</Copy>
            </div>
            <div className="dest-gate-weds dest-serif">Weds</div>
            <div className="dest-gate-names dest-serif">
              <Copy as="span" field="gate.bride" label="gate · bride name">{d.bride.split(' ')[0]}</Copy>
            </div>
            <div className="dest-gate-date">{formatDate(d.date)}</div>
            {phase === 'closed' && (
              <button className="dest-gate-btn" onClick={handleEnter}>Open Invitation</button>
            )}
          </div>
        </InvitationSection>

        {phase === 'open' && <>

          {/* ══════ HERO ══════ */}
          <InvitationSection data-invite-section="hero" className="dest-hero">
            <img className="dest-hero-bg" src={`${A}background_main.webp`} alt="" />
            <div className="dest-hero-overlay" />
            <div className="dest-hero-inner">
              <Lantern style={{ top: '5%', left: '3%' }} />
              <Lantern style={{ top: '10%', right: '5%', width: '42px' }} />
              <Lantern style={{ bottom: '15%', left: '8%', width: '38px' }} />
              <p className="dest-hero-blessing dest-anim">With the heavenly blessings of</p>
              <div className="dest-hero-names dest-serif dest-anim dest-anim-d1">
                <Copy as="span" field="hero.groom" label="hero · groom name">{d.groom}</Copy>
                <span className="dest-hero-amp">Weds</span>
                <Copy as="span" field="hero.bride" label="hero · bride name">{d.bride}</Copy>
              </div>
              <Copy as="p" field="hero.date" label="hero · date" className="dest-hero-date dest-anim dest-anim-d2">{formatDate(d.date)}</Copy>
              <Copy as="p" field="hero.venue" label="hero · venue" className="dest-hero-venue dest-anim dest-anim-d3">{d.venue}</Copy>
            </div>
          </InvitationSection>

          {/* ══════ BLESSINGS / FAMILY ══════ */}
          {(d.groomFamily || d.brideFamily) && (
            <InvitationSection data-invite-section="blessings" className="dest-blessings">
              <GaneshaSvg className="dest-blessings-ganesh dest-anim" />
              <h2 className="dest-blessings-heading dest-serif dest-anim dest-anim-d1">
                With the blessings of the Almighty and our beloved elders
              </h2>
              <div className="dest-divider-diamond dest-anim dest-anim-d2"><span /><i>◇</i><span /></div>
              <div className="dest-family-block">
                {d.groomFamily && (
                  <div className="dest-family-pair dest-anim dest-anim-d2">
                    <span className="dest-family-label">Groom's Family</span>
                    <Copy as="p" field="families.groom" label="families · groom family">{d.groomFamily}</Copy>
                  </div>
                )}
                {d.groomFamily && d.brideFamily && (
                  <p className="dest-family-together dest-anim dest-anim-d3">together with</p>
                )}
                {d.brideFamily && (
                  <div className="dest-family-pair dest-anim dest-anim-d3">
                    <span className="dest-family-label">Bride's Family</span>
                    <Copy as="p" field="families.bride" label="families · bride family">{d.brideFamily}</Copy>
                  </div>
                )}
              </div>
              <p className="dest-blessings-invite dest-anim dest-anim-d4">
                cordially invite you to grace the auspicious occasion of their beloved's wedding
              </p>
            </InvitationSection>
          )}

          {/* ══════ COUPLE MESSAGE ══════ */}
          {d.message && (
            <InvitationSection data-invite-section="message" className="dest-message">
              <img className="dest-message-bg" src={`${A}background_image2.webp`} alt="" />
              <div className="dest-message-inner">
                <h2 className="dest-message-heading dest-serif dest-anim">Words of Love</h2>
                <div className="dest-divider-diamond dest-anim dest-anim-d1"><span /><i>◇</i><span /></div>
                <Copy as="p" field="message.text" label="couple · message" className="dest-message-text dest-anim dest-anim-d2">{d.message}</Copy>
              </div>
            </InvitationSection>
          )}

          {/* ══════ EVENTS ══════ */}
          <InvitationSection data-invite-section="events" className="dest-events">
            <img className="dest-events-bg" src={`${A}event_background.webp`} alt="" />
            <img className="dest-events-flower dest-events-flower-top" src={`${A}event_flower_up.webp`} alt="" />
            <img className="dest-events-flower dest-events-flower-bottom" src={`${A}event_flower_down.webp`} alt="" />
            <div className="dest-events-inner">
              {d.events.map((event, index) => (
                <DestinationCelebrationCard
                  key={event.id || index}
                  event={event}
                  eventKey={event.id || `legacy-${index}`}
                  dressCode={d.dressCode}
                />
              ))}
            </div>
          </InvitationSection>

          {/* ══════ COUNTDOWN ══════ */}
          <InvitationSection data-invite-section="countdown" className="dest-countdown">
            <img className="dest-countdown-bg" src={`${A}background_main_countdown.webp`} alt="" />
            <div className="dest-countdown-overlay" />
            <div className="dest-countdown-inner dest-anim">
              <h2 className="dest-countdown-heading dest-serif">{passed ? 'Our Beautiful Beginning' : 'Wedding Countdown'}</h2>
              <div className="dest-countdown-grid">
                {[
                  { n: days, l: 'Days' },
                  { n: hours, l: 'Hours' },
                  { n: minutes, l: 'Minutes' },
                  { n: seconds, l: 'Seconds' },
                ].map(({ n, l }) => (
                  <div className="dest-countdown-unit" key={l}>
                    <strong className="dest-countdown-num dest-serif">{String(n).padStart(2, '0')}</strong>
                    <span className="dest-countdown-label">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </InvitationSection>

          {/* ══════ SCRATCH / SAVE THE DATE ══════ */}
          <InvitationSection data-invite-section="scratch" className="dest-scratch">
            <h2 className="dest-scratch-heading dest-serif dest-anim">Save the Date</h2>
            <p className="dest-scratch-hint dest-anim dest-anim-d1">Scratch to reveal</p>
            <div className="dest-scratch-box dest-anim dest-anim-d2">
              <img className="dest-scratch-reveal" src={`${A}save_date_car.webp`} alt="Save the Date" />
              <canvas className="dest-scratch-canvas" ref={canvasRef} />
            </div>
            <p className={`dest-scratch-date dest-serif${scratchRevealed ? ' dest-revealed' : ''}`}>
              {formatDate(d.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </InvitationSection>

          {/* ══════ RSVP ══════ */}
          <InvitationSection data-invite-section="rsvp" className="dest-rsvp">
            <h2 className="dest-rsvp-heading dest-serif dest-anim">Will You Join Us?</h2>
            <p className="dest-rsvp-sub dest-anim dest-anim-d1">
              We would be truly honoured to celebrate this day with you. Please let us know if you'll be joining the festivities.
            </p>
            <div className="dest-anim dest-anim-d2">
              <a className="dest-rsvp-btn" href={rsvpHref} target="_blank" rel="noreferrer">
                <WhatsAppIcon />
                <span>RSVP on WhatsApp</span>
              </a>
            </div>
          </InvitationSection>

          {/* ══════ FOOTER ══════ */}
          <InvitationSection as="footer" data-invite-section="footer" className="dest-footer">
            <img className="dest-footer-bg" src={`${A}footer.webp`} alt="" />
            <div className="dest-footer-overlay" />
            <div className="dest-footer-inner dest-anim">
              <div className="dest-footer-names dest-serif">
                <Copy as="span" field="closing.groom" label="closing · groom name">{d.groom}</Copy>
                <span className="dest-footer-amp">♥</span>
                <Copy as="span" field="closing.bride" label="closing · bride name">{d.bride}</Copy>
              </div>
              <p className="dest-footer-date">{formatDate(d.date)}</p>
              <p className="dest-footer-hashtag">#{d.groom.replace(/\s/g, '')}Weds{d.bride.replace(/\s/g, '')}</p>
            </div>
          </InvitationSection>

        </>}
      </main>
    </InvitationLayoutProvider>
  )
}
