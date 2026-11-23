import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { content } from './data'
import { useStory } from './useStory'
import deorhi from './assets/deorhi.webp'
import doorL from './assets/door-l.webp'
import doorR from './assets/door-r.webp'
import envelope from './assets/envelope.webp'
import courtyard from './assets/courtyard.webp'
import roofNight from './assets/roof-night.webp'
import gaagar from './assets/gaagar.webp'
import charpai from './assets/charpai.webp'
import diya from './assets/diya.webp'
import bagh0 from './assets/bagh0.webp'
import bagh1 from './assets/bagh1.webp'
import bagh2 from './assets/bagh2.webp'
import bagh3 from './assets/bagh3.webp'
import road from './assets/road.webp'
import milestone from './assets/milestone.webp'
import trolley from './assets/trolley.webp'
import parrots from './assets/s1-parrots.webp'
import floor from './assets/s2-floor.webp'
import shawls from './assets/shawls.webp'
import shawlsGreen from './assets/shawls-green.webp'
import palla from './assets/palla.webp'
import shoes from './assets/shoes.webp'
import inside from './assets/inside.webp'
import car from './assets/car.webp'
import thaal from './assets/thaal.webp'
import bahi from './assets/bahi.webp'
import './story.css'

const BAGH = [bagh0, bagh1, bagh2, bagh3]
const MAP_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.mapQuery)}`

// Fixed values instead of Math.random: renders stay stable and testable.
const FIREFLIES = [
  { x: 14, y: 52, d: 0, t: 5 },
  { x: 30, y: 64, d: 2, t: 6 },
  { x: 46, y: 50, d: 4, t: 5.5 },
  { x: 62, y: 66, d: 1, t: 7 },
  { x: 78, y: 56, d: 3, t: 6 },
  { x: 90, y: 68, d: 5, t: 5 },
]
const GRAINS = [
  { x: -90, y: -170, r: -60 },
  { x: -50, y: -220, r: 40 },
  { x: -10, y: -250, r: -20 },
  { x: 30, y: -230, r: 70 },
  { x: 70, y: -190, r: -80 },
  { x: 100, y: -150, r: 30 },
  { x: -70, y: -130, r: 90 },
  { x: 55, y: -120, r: -50 },
]

/** One gold thread per scene. It is drawn by the scene's own progress, so it is never a separate engine. */
function Thread({ d, from = 0, to = 1 }: { d: string; from?: number; to?: number }) {
  return (
    <svg className="ps-thread" style={{ '--t0': from, '--t1': to } as CSSProperties} viewBox="0 0 39 84.4" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d={d} pathLength={1} />
    </svg>
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

function Stack({ side, family, caption }: { side: 'groom' | 'bride'; family: { label: string; lines: readonly string[] }; caption: string }) {
  return (
    <figure className={`ps-stack ps-stack--${side}`}>
      <div className="ps-stack__art">
        <img src={side === 'groom' ? shawls : shawlsGreen} alt="" decoding="async" />
        <div className="ps-stack__face">
          <p className="ps-stack__label">{family.label}</p>
          <p className="ps-stack__name">{family.lines[0]}</p>
          <p className="ps-stack__name">{family.lines[1]}</p>
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function Reply() {
  const [answer, setAnswer] = useState<'yes' | 'no'>('yes')
  const [guests, setGuests] = useState(2)
  const [sent, setSent] = useState<string | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = String(new FormData(event.currentTarget).get('name') || '').trim()
    if (name) setSent(name)
  }

  const manjas = answer === 'yes' ? guests : 1

  return (
    <section className="ps-final" aria-label="Reply">
      <img className="ps-final__bg" src={courtyard} alt="" decoding="async" />
      <div className="ps-final__dusk" />
      <div className="ps-final__body">
        <p className="ps-eyebrow ps-eyebrow--light">Kindly reply by 1 February</p>
        <h2 className="ps-final__title">A manja is kept for you</h2>

        {sent ? (
          <div className="ps-thanks" role="status">
            <div className="ps-ledger-photo">
              <img src={bahi} alt="" decoding="async" />
              <span className="ps-ledger-photo__name">{sent}</span>
            </div>
            <div className="ps-manjas" data-count={manjas}>
              <div className="ps-orbit" aria-hidden="true">
                <img src={diya} alt="" />
              </div>
              {Array.from({ length: manjas }, (_, index) => (
                <div className="ps-manja" key={index} style={{ '--i': index } as CSSProperties}>
                  <img src={charpai} alt="" decoding="async" />
                  {index === 0 ? <span className="ps-manja__name">{sent}</span> : null}
                </div>
              ))}
            </div>
            <p className="ps-thanks__line">
              {answer === 'yes' ? `Your manja is kept, ${sent}. We cannot wait.` : `Thank you, ${sent}. Your blessings are kept with us.`}
            </p>
          </div>
        ) : (
          <form className="ps-ledger" onSubmit={submit}>
            <label className="ps-field">
              <span>Your name</span>
              <input name="name" autoComplete="name" required placeholder="As on the invitation" />
            </label>
            <div className="ps-choice" role="radiogroup" aria-label="Attendance">
              <button type="button" role="radio" aria-checked={answer === 'yes'} onClick={() => setAnswer('yes')}>
                <b>Joyfully attending</b>
                <span lang="pa">ਆਵਾਂਗੇ</span>
              </button>
              <button type="button" role="radio" aria-checked={answer === 'no'} onClick={() => setAnswer('no')}>
                <b>Sending blessings</b>
                <span lang="pa">ਅਸੀਸਾਂ ਭੇਜਾਂਗੇ</span>
              </button>
            </div>
            {answer === 'yes' ? (
              <div className="ps-field">
                <span id="guest-label">Guests, including you</span>
                <div className="ps-stepper" role="group" aria-labelledby="guest-label">
                  <button type="button" aria-label="Fewer guests" onClick={() => setGuests((n) => Math.max(1, n - 1))}>
                    −
                  </button>
                  <output aria-live="polite">{guests}</output>
                  <button type="button" aria-label="More guests" onClick={() => setGuests((n) => Math.min(6, n + 1))}>
                    +
                  </button>
                </div>
              </div>
            ) : null}
            <button className="ps-submit" type="submit">
              Send reply
            </button>
          </form>
        )}

        <div className="ps-links">
          <a href={MAP_HREF} target="_blank" rel="noreferrer">
            Open the map
          </a>
          <a href={calendarHref()} download="wedding.ics">
            Add to calendar
          </a>
        </div>
      </div>
    </section>
  )
}

export default function PunjabiStory() {
  const root = useRef<HTMLElement>(null)
  useStory(root)
  const count = useCountdown(content.dateISO)
  const [throws, setThrows] = useState(0)
  const [burst, setBurst] = useState(0)
  const units: [string, number][] = [
    ['Days', count.days],
    ['Hours', count.hours],
    ['Min', count.minutes],
    ['Sec', count.seconds],
  ]

  const throwRice = () => {
    setThrows((n) => Math.min(3, n + 1))
    setBurst((n) => n + 1)
    window.scrollBy({ top: window.innerHeight * 0.3, behavior: 'smooth' })
  }

  return (
    <main className="ps-root" ref={root}>
      <div className="ps-progress" aria-hidden="true" />

      {/* 1. Shagun at the door: the names arrive in an envelope, then the doors turn open. */}
      <section className="ps-track ps-t1" data-scene="shagun" aria-label="Invitation">
        <div className="ps-stage ps-s1">
          <div className="ps-s1-sky" />
          <p className="ps-s1-eyebrow">Together with their families</p>
          <div className="ps-s1-gate">
            <div className="ps-s1-view">
              <img className="ps-s1-yard" src={courtyard} alt="" decoding="async" />
              <img className="ps-s1-door ps-s1-door--l" src={doorL} alt="" decoding="async" />
              <img className="ps-s1-door ps-s1-door--r" src={doorR} alt="" decoding="async" />
              <p className="ps-s1-plate">{content.dateLabel}</p>
            </div>
            <img className="ps-s1-frame" src={deorhi} alt="" decoding="async" />
          </div>
          <div className="ps-s1-envelope">
            <img src={envelope} alt="" decoding="async" />
            <h1 className="ps-s1-names">
              <span>{content.groom}</span>
              <span>
                <i>&amp;</i> {content.bride}
              </span>
            </h1>
          </div>
          <Thread d="M19.5 40 C 12 50, 28 62, 19.5 84.4" from={0.5} to={0.9} />
          <p className="ps-hint" aria-hidden="true">
            Scroll
          </p>
        </div>
      </section>

      {/* 2. Jaago: the date and the countdown live on the lamp-pot. */}
      <section className="ps-track ps-t2" data-scene="jaago" aria-label="Date and countdown">
        <div className="ps-stage ps-s2">
          <div className="ps-s2-plate">
            <img src={roofNight} alt="" decoding="async" />
          </div>
          <div className="ps-s2-glow" />
          <div className="ps-s2-flies" aria-hidden="true">
            {FIREFLIES.map((fly, index) => (
              <span key={index} style={{ left: `${fly.x}%`, top: `${fly.y}%`, animationDelay: `-${fly.d}s`, animationDuration: `${fly.t}s` }} />
            ))}
          </div>
          <p className="ps-s2-eyebrow">Jaago. The night is awake.</p>
          <div className="ps-s2-gaagar">
            <img src={gaagar} alt="" decoding="async" />
            <div className="ps-tag">
              <p className="ps-tag__date">14 · 02 · 2027 · 10:00</p>
              <dl className="ps-tag__units">
                {units.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{String(value).padStart(2, '0')}</dd>
                  </div>
                ))}
              </dl>
              <span className="ps-sr">Until {content.dateLabel}</span>
            </div>
          </div>
          <Thread d="M19.5 0 C 10 14, 29 26, 19.5 44" from={0.15} to={0.7} />
        </div>
      </section>

      {/* 3. The bagh: each event is a panel of the phulkari. */}
      <section className="ps-track ps-t3" data-scene="bagh" data-steps={content.events.length} aria-label="The celebrations">
        <div className="ps-stage ps-s3">
          <div className="ps-s3-wall">
            <img src={courtyard} alt="" decoding="async" />
          </div>
          <div className="ps-s3-dawn" />
          <p className="ps-s3-eyebrow">Four days of celebration</p>
          <div className="ps-s3-charpai">
            <img src={charpai} alt="" decoding="async" />
          </div>
          <div className="ps-s3-diya">
            <img src={diya} alt="" decoding="async" />
          </div>
          <div className="ps-s3-view">
            <ol className="ps-s3-strip">
              {content.events.map((event, index) => (
                <li className="ps-bagh" key={event.id}>
                  <div className="ps-bagh__cloth">
                    <img src={BAGH[index]} alt="" decoding="async" />
                    <div className="ps-bagh__text">
                      <h2>{event.name}</h2>
                      <p>
                        {event.day} · {event.time}
                      </p>
                    </div>
                  </div>
                  <p className="ps-bagh__note">{event.note}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="ps-s3-dots" aria-hidden="true">
            {content.events.map((event, index) => (
              <span key={event.id} style={{ '--i': index } as CSSProperties} />
            ))}
          </div>
          <Thread d="M0 70 C 12 66, 26 74, 39 68" from={0.05} to={0.95} />
        </div>
      </section>

      {/* 4. The road: the venue is on the milestone. */}
      <section className="ps-track ps-t4" data-scene="road" aria-label="Venue">
        <div className="ps-stage ps-s4">
          <div className="ps-s4-plate">
            <img src={road} alt="" decoding="async" />
          </div>
          <div className="ps-s4-parrots" aria-hidden="true">
            <img src={parrots} alt="" decoding="async" />
          </div>
          <p className="ps-s4-eyebrow">The baraat is on its way</p>
          <div className="ps-s4-trolley" aria-hidden="true">
            <img src={trolley} alt="" decoding="async" />
          </div>
          <a className="ps-s4-stone" href={MAP_HREF} target="_blank" rel="noreferrer" aria-label={`Open the map to ${content.venueName}`}>
            <img src={milestone} alt="" decoding="async" />
            <span className="ps-s4-stone__text">
              <b>{content.venueName}</b>
              <i>Ludhiana</i>
              <u>Open map</u>
            </span>
          </a>
          <Thread d="M19.5 84.4 C 28 70, 10 56, 19.5 30 C 24 20, 16 10, 19.5 0" from={0} to={1} />
        </div>
      </section>

      {/* 5. Milni: two families meet; their names are on the top shawl of each stack. */}
      <section className="ps-track ps-t5" data-scene="milni" aria-label="The families">
        <div className="ps-stage ps-s5">
          <div className="ps-s5-floor">
            <img src={floor} alt="" decoding="async" />
          </div>
          <Stack side="groom" family={content.groomFamily} caption={content.groomFamily.lines[2]} />
          <Stack side="bride" family={content.brideFamily} caption={content.brideFamily.lines[2]} />
          <Thread d="M5 36 C 14 40, 24 44, 34 48" from={0.6} to={0.95} />
        </div>
      </section>

      {/* 6. The hush: nothing to read. Only a pulled-back look, then what is left outside. */}
      <section className="ps-track ps-t6" data-scene="hush" aria-label="A quiet moment">
        <div className="ps-stage ps-s6">
          <div className="ps-s6-palla">
            <img src={palla} alt="" decoding="async" />
          </div>
          <div className="ps-s6-shoes">
            <img src={shoes} alt="" decoding="async" />
          </div>
          <Thread d="M0 20 C 10 30, 18 24, 24 40 C 30 56, 36 60, 39 70" from={0} to={0.8} />
        </div>
      </section>

      {/* 7. Doli: phulian over the shoulder, and the blessing under the rice. */}
      <section className="ps-track ps-t7" data-scene="doli" aria-label="Blessing">
        <div className="ps-stage ps-s7" style={{ '--tb': throws * 0.25 } as CSSProperties}>
          <div className="ps-s7-plate">
            <img src={inside} alt="" decoding="async" />
          </div>
          <p className="ps-s7-eyebrow">That the house may always stay full</p>
          <div className="ps-s7-car" aria-hidden="true">
            <img src={car} alt="" decoding="async" />
          </div>
          <div className="ps-s7-blessing">
            <p className="ps-s7-gurmukhi" lang="pa">
              {content.blessing}
            </p>
            <p className="ps-s7-latin">{content.blessingLatin}</p>
          </div>
          <div className="ps-s7-rice" aria-hidden="true" />
          <div className="ps-s7-dusk" aria-hidden="true" />
          <button type="button" className="ps-s7-thaal" onClick={throwRice} aria-label="Throw a handful of puffed rice over your shoulder">
            <img src={thaal} alt="" decoding="async" />
            <span className="ps-s7-tap">Tap to throw</span>
            <span className="ps-s7-grains" key={burst} aria-hidden="true">
              {burst > 0
                ? GRAINS.map((grain, index) => (
                    <i key={index} style={{ '--gx': `${grain.x}px`, '--gy': `${grain.y}px`, '--gr': `${grain.r}deg` } as CSSProperties} />
                  ))
                : null}
            </span>
          </button>
          <div className="ps-s7-diya" aria-hidden="true">
            <img src={diya} alt="" decoding="async" />
          </div>
          <Thread d="M39 40 C 30 52, 10 60, 19.5 84.4" from={0.2} to={0.9} />
        </div>
      </section>

      {/* 8. A manja is kept for you. */}
      <Reply />
    </main>
  )
}
