import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { content } from './data'
import { useJourney } from './useJourney'
import s1Sky from './assets/s1-sky.webp'
import s1Haveli from './assets/s1-haveli.webp'
import s1FieldMid from './assets/s1-field-mid.webp'
import s1FieldFront from './assets/s1-field-front.webp'
import s1Trees from './assets/s1-trees.webp'
import s1Garlands from './assets/s1-garlands.webp'
import s1Parrots from './assets/s1-parrots.webp'
import s2Wall from './assets/s2-wall.webp'
import s2Arcade from './assets/s2-arcade.webp'
import s2Canopy from './assets/s2-canopy.webp'
import s2Floor from './assets/s2-floor.webp'
import s2Jharokha from './assets/s2-jharokha.webp'
import s3Sky from './assets/s3-sky.webp'
import s3Roofs from './assets/s3-roofs.webp'
import s3Kites from './assets/s3-kites.webp'
import s3Parapet from './assets/s3-parapet.webp'
import s3Medallion from './assets/s3-medallion.webp'
import s4Lane from './assets/s4-lane.webp'
import s4Strings from './assets/s4-strings.webp'
import s4Dhol from './assets/s4-dhol.webp'
import s4Henna from './assets/s4-henna.webp'
import s4Chooda from './assets/s4-chooda.webp'
import s4Laddoo from './assets/s4-laddoo.webp'
import s5NightSky from './assets/s5-night-sky.webp'
import s5FieldNight from './assets/s5-field-night.webp'
import s6HaveliLit from './assets/s6-haveli-lit.webp'
import './journey.css'

const MOTIFS = { dhol: s4Dhol, henna: s4Henna, chooda: s4Chooda, laddoo: s4Laddoo }

// Fixed positions instead of Math.random: renders stay stable and testable.
const PETALS = [
  { x: 8, d: 0, t: 13, s: 0.9 },
  { x: 24, d: 4, t: 17, s: 0.7 },
  { x: 39, d: 9, t: 15, s: 1 },
  { x: 55, d: 2, t: 19, s: 0.8 },
  { x: 68, d: 7, t: 14, s: 0.65 },
  { x: 82, d: 11, t: 18, s: 0.95 },
  { x: 93, d: 5, t: 16, s: 0.75 },
]
const FIREFLIES = [
  { x: 12, y: 58, d: 0, t: 5 },
  { x: 27, y: 66, d: 2, t: 6 },
  { x: 41, y: 54, d: 4, t: 5.5 },
  { x: 56, y: 70, d: 1, t: 7 },
  { x: 70, y: 60, d: 3, t: 6 },
  { x: 84, y: 68, d: 5, t: 5 },
  { x: 92, y: 55, d: 2.5, t: 6.5 },
]

function Petals() {
  return (
    <div className="pj-layer pj-petals" aria-hidden="true">
      {PETALS.map((petal, index) => (
        <span key={index} className="pj-petal" style={{ left: `${petal.x}%`, animationDelay: `-${petal.d}s`, animationDuration: `${petal.t}s`, scale: petal.s }} />
      ))}
    </div>
  )
}

function Fireflies() {
  return (
    <div className="pj-layer pj-fireflies" aria-hidden="true">
      {FIREFLIES.map((fly, index) => (
        <span key={index} className="pj-firefly" style={{ left: `${fly.x}%`, top: `${fly.y}%`, animationDelay: `-${fly.d}s`, animationDuration: `${fly.t}s` }} />
      ))}
    </div>
  )
}

function useCountdown(targetISO: string) {
  const target = new Date(targetISO).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const left = Math.max(0, target - now)
  return {
    days: Math.floor(left / 86_400_000),
    hours: Math.floor(left / 3_600_000) % 24,
    minutes: Math.floor(left / 60_000) % 60,
    seconds: Math.floor(left / 1000) % 60,
  }
}

function calendarHref() {
  const start = new Date(content.dateISO)
  const end = new Date(start.getTime() + 4 * 3_600_000)
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${content.groom} & ${content.bride}: Wedding`,
    `LOCATION:${content.venueName}, ${content.venueAddress}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(body)}`
}

function FamilyCard({ side, family }: { side: 'groom' | 'bride'; family: { label: string; lines: readonly string[] } }) {
  return (
    <figure className={`pj-family pj-family--${side}`}>
      <div className="pj-family__paper">
        <p className="pj-eyebrow">{family.label}</p>
        <p className="pj-family__name">{family.lines[0]}</p>
        <p className="pj-family__name">{family.lines[1]}</p>
        <p className="pj-family__line">{family.lines[2]}</p>
      </div>
      <img className="pj-family__frame" src={s2Jharokha} alt="" decoding="async" />
    </figure>
  )
}

function Rsvp() {
  const [answer, setAnswer] = useState<'yes' | 'no'>('yes')
  const [sent, setSent] = useState<string | null>(null)
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    if (name) setSent(name)
  }
  return (
    <div className="pj-rsvp">
      <p className="pj-eyebrow">Kindly reply by 1 February</p>
      <h2 className="pj-rsvp__title">Will you join us?</h2>
      {sent ? (
        <div className="pj-rsvp__thanks" role="status">
          <p>{answer === 'yes' ? `Wonderful, ${sent}. We will keep a place for you.` : `Thank you, ${sent}. You will be in our thoughts.`}</p>
          <a className="pj-link" href={calendarHref()} download="wedding.ics">
            Add the wedding to your calendar
          </a>
        </div>
      ) : (
        <form onSubmit={submit}>
          <label className="pj-field">
            <span>Your name</span>
            <input name="name" autoComplete="name" required placeholder="As on the invitation" />
          </label>
          <div className="pj-choice" role="radiogroup" aria-label="Attendance">
            <button type="button" role="radio" aria-checked={answer === 'yes'} onClick={() => setAnswer('yes')}>
              Joyfully accept
            </button>
            <button type="button" role="radio" aria-checked={answer === 'no'} onClick={() => setAnswer('no')}>
              Regretfully decline
            </button>
          </div>
          {answer === 'yes' ? (
            <label className="pj-field">
              <span>Guests (including you)</span>
              <select name="guests" defaultValue="2">
                {[1, 2, 3, 4, 5].map((count) => (
                  <option key={count} value={count}>
                    {count}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <button className="pj-submit" type="submit">
            Send reply
          </button>
        </form>
      )}
      <div className="pj-rsvp__links">
        <a className="pj-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.mapQuery)}`} target="_blank" rel="noreferrer">
          Open the map
        </a>
        <a className="pj-link" href={calendarHref()} download="wedding.ics">
          Add to calendar
        </a>
      </div>
    </div>
  )
}

export default function PunjabiJourney() {
  const root = useRef<HTMLElement>(null)
  useJourney(root)
  const count = useCountdown(content.dateISO)
  const units: [string, number][] = [
    ['Days', count.days],
    ['Hours', count.hours],
    ['Minutes', count.minutes],
    ['Seconds', count.seconds],
  ]

  return (
    <main className="pj-root" ref={root}>
      <div className="pj-progress" aria-hidden="true" />

      {/* 1. The gate: dawn over the mustard fields */}
      <section className="pj-track pj-track--gate" data-scene="gate" aria-label="Invitation">
        <div className="pj-stage pj-stage--gate">
          <div className="pj-layer pj-g-sky"><img src={s1Sky} alt="" decoding="async" /></div>
          <div className="pj-layer pj-g-parrots"><img src={s1Parrots} alt="" decoding="async" /></div>
          <div className="pj-layer pj-g-haveli"><img src={s1Haveli} alt="" decoding="async" /></div>
          <div className="pj-layer pj-g-ground" />
          <div className="pj-layer pj-g-trees"><img src={s1Trees} alt="" decoding="async" /></div>
          <div className="pj-layer pj-g-mid"><img src={s1FieldMid} alt="" decoding="async" /></div>
          <div className="pj-layer pj-g-front"><img src={s1FieldFront} alt="" decoding="async" /></div>
          <Petals />
          <div className="pj-layer pj-g-garlands"><img src={s1Garlands} alt="" decoding="async" /></div>

          <div className="pj-copy pj-g-intro">
            <p className="pj-eyebrow">Together with their families</p>
            <h1 className="pj-names pj-names--stack">
              <span>{content.groom}</span>
              <span>
                <i>&amp;</i> {content.bride}
              </span>
            </h1>
            <p className="pj-date">{content.dateLabel}</p>
          </div>
          <div className="pj-copy pj-g-gate">
            <p className="pj-eyebrow pj-eyebrow--light">Step through the gate</p>
            <p className="pj-line">come, celebrate with us</p>
          </div>
          <div className="pj-hint" aria-hidden="true"><span>Scroll</span><i /></div>
        </div>
      </section>

      {/* 2. The courtyard: both families */}
      <section className="pj-track pj-track--court" data-scene="court" aria-label="The families">
        <div className="pj-stage pj-stage--court">
          <div className="pj-layer pj-c-wall"><img src={s2Wall} alt="" decoding="async" /></div>
          <div className="pj-layer pj-c-arcade pj-c-arcade--l"><img src={s2Arcade} alt="" decoding="async" /></div>
          <div className="pj-layer pj-c-arcade pj-c-arcade--r"><img src={s2Arcade} alt="" decoding="async" /></div>
          <div className="pj-layer pj-c-floor"><img src={s2Floor} alt="" decoding="async" /></div>
          <Petals />
          <div className="pj-layer pj-c-canopy"><img src={s2Canopy} alt="" decoding="async" /></div>

          <div className="pj-copy pj-c-title">
            <p className="pj-eyebrow pj-eyebrow--light">Two families, one celebration</p>
          </div>
          <FamilyCard side="groom" family={content.groomFamily} />
          <FamilyCard side="bride" family={content.brideFamily} />
          <div className="pj-copy pj-c-names">
            <p className="pj-eyebrow">With joy we announce</p>
            <p className="pj-names pj-names--paper">
              {content.groom} <i>&amp;</i> {content.bride}
            </p>
            <p className="pj-date">{content.dateLabel}</p>
          </div>
        </div>
      </section>

      {/* 3. The rooftop at dusk: countdown */}
      <section className="pj-track pj-track--roof" data-scene="roof" aria-label="Countdown">
        <div className="pj-stage pj-stage--roof">
          <div className="pj-layer pj-r-sky"><img src={s3Sky} alt="" decoding="async" /></div>
          <div className="pj-layer pj-r-kites pj-r-kites--far"><img src={s3Kites} alt="" decoding="async" /></div>
          <div className="pj-layer pj-r-roofs"><img src={s3Roofs} alt="" decoding="async" /></div>
          <div className="pj-layer pj-r-kites pj-r-kites--near"><img src={s3Kites} alt="" decoding="async" /></div>
          <div className="pj-layer pj-r-parapet"><img src={s3Parapet} alt="" decoding="async" /></div>

          <div className="pj-copy pj-r-title">
            <p className="pj-eyebrow pj-eyebrow--light">Counting down to</p>
            <p className="pj-line pj-line--small">{content.dateLabel}</p>
          </div>
          <div className="pj-r-grid" role="timer" aria-label="Time until the wedding">
            {units.map(([label, value], index) => (
              <div key={label} className="pj-medallion" style={{ '--i': index } as CSSProperties}>
                <img src={s3Medallion} alt="" decoding="async" />
                <span className="pj-medallion__value">{String(value).padStart(2, '0')}</span>
                <span className="pj-medallion__label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The lantern lane: celebrations */}
      <section className="pj-track pj-track--lane" data-scene="lane" data-steps={content.events.length} aria-label="Celebrations">
        <div className="pj-stage pj-stage--lane" style={{ '--n': content.events.length } as CSSProperties}>
          <div className="pj-layer pj-l-lane"><img src={s4Lane} alt="" decoding="async" /></div>
          <div className="pj-layer pj-l-strings"><img src={s4Strings} alt="" decoding="async" /></div>
          <div className="pj-copy pj-l-title">
            <p className="pj-eyebrow pj-eyebrow--light">Four days of celebration</p>
          </div>
          <div className="pj-l-window">
            <div className="pj-l-cards">
              {content.events.map((event, index) => (
                <div key={event.id} className="pj-l-slot">
                  <article className="pj-card" style={{ '--k': index } as CSSProperties}>
                    <img className="pj-card__motif" src={MOTIFS[event.motif]} alt="" decoding="async" />
                    <p className="pj-eyebrow">{event.day}</p>
                    <h2 className="pj-card__name">{event.name}</h2>
                    <p className="pj-card__time">{event.time}</p>
                    <p className="pj-card__note">{event.note}</p>
                    <p className="pj-card__venue">{content.venueName}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
          <div className="pj-l-dots" aria-hidden="true">
            {content.events.map((event, index) => (
              <i key={event.id} style={{ '--k': index } as CSSProperties} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. The night field: RSVP */}
      <section className="pj-track pj-track--night" data-scene="night" aria-label="RSVP">
        <div className="pj-stage pj-stage--night">
          <div className="pj-layer pj-n-sky"><img src={s5NightSky} alt="" decoding="async" /></div>
          <div className="pj-layer pj-n-ground" />
          <div className="pj-layer pj-n-field"><img src={s5FieldNight} alt="" decoding="async" /></div>
          <Fireflies />
          <div className="pj-n-card"><Rsvp /></div>
        </div>
      </section>

      {/* 6. The gate at night: closing */}
      <section className="pj-track pj-track--close" data-scene="close" aria-label="Closing">
        <div className="pj-stage pj-stage--close">
          <div className="pj-layer pj-x-sky"><img src={s5NightSky} alt="" decoding="async" /></div>
          <div className="pj-layer pj-x-haveli"><img src={s6HaveliLit} alt="" decoding="async" /></div>
          <div className="pj-layer pj-x-ground" />
          <div className="pj-layer pj-x-field"><img src={s5FieldNight} alt="" decoding="async" /></div>
          <Fireflies />
          <div className="pj-copy pj-x-copy">
            <p className="pj-gurmukhi">{content.blessing}</p>
            <p className="pj-eyebrow pj-eyebrow--light">{content.blessingLatin}</p>
            <p className="pj-names pj-names--night">
              {content.groom} <i>&amp;</i> {content.bride}
            </p>
            <p className="pj-date pj-date--light">{content.dateLabel} · {content.venueName}, Ludhiana</p>
          </div>
        </div>
      </section>
    </main>
  )
}
