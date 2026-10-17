import PersonalNotes from '../invitations/PersonalNotes'
import '../invitations/personalized.css'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO } from '../invitations/model'
import Celebrations from '../invitations/Celebrations'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, ReactNode } from 'react'
import './Design8.css'

const EVENT = new Date('2027-02-12T16:00:00+05:30').getTime()
const MAP = 'https://www.google.com/maps/search/?api=1&query=Taj+Falaknuma+Palace+Hyderabad'
const KEY = 'noor-rsvp-v1'

function Star({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true"><path d="m20 1 5.5 13.5L39 20l-13.5 5.5L20 39l-5.5-13.5L1 20l13.5-5.5Z" stroke="currentColor"/><path d="m20 9 3.2 7.8L31 20l-7.8 3.2L20 31l-3.2-7.8L9 20l7.8-3.2Z" fill="currentColor"/></svg>
}
function Sprig({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 220 340" fill="none" aria-hidden="true"><g stroke="#7d8964" strokeWidth="1.4"><path d="M34 324C120 245 79 143 184 26M82 254 29 184M104 199l72-48M125 120 83 65M99 220l76 31M146 77l48-6"/>{[[59,287,-38],[79,251,40],[91,219,-42],[102,187,35],[109,152,-35],[129,116,30],[151,72,-30],[49,211,-30],[142,174,40],[141,240,58],[98,88,-25]].map(([x,y,r],i)=><path key={i} d="M0 0Q-24-15-12-43Q8-31 0 0Z" fill={i%2?'#8e9b78':'#acb493'} strokeOpacity=".5" transform={`translate(${x} ${y}) rotate(${r})`}/>)}</g>{[[180,31,1],[83,67,.8],[27,183,.9],[177,149,1],[181,253,.7]].map(([x,y,s],i)=><g key={i} transform={`translate(${x} ${y}) scale(${s})`}>{[0,72,144,216,288].map(r=><ellipse key={r} cx="0" cy="-10" rx="7" ry="12" transform={`rotate(${r})`} fill="#fcf9ec" stroke="#c8bd94" strokeWidth=".6"/>)}<circle r="4" fill="#bea46b"/></g>)}</svg>
}
function CeremonyIllustration({ kind }: { kind: string }) {
  return <svg className="nr-ceremony-drawing" viewBox="0 0 200 160" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
    {kind === '01' ? <><path d="M35 124h130M42 130h116M59 117h35M106 117h35M64 108h24M112 108h24M67 108V92M121 108V92M48 62h41l-3 20q-2 12-18 12T51 82ZM100 62h41l-3 20q-2 12-18 12t-17-12Z"/><path d="M89 65h8q7 10-10 16M141 65h8q7 10-10 16M58 75h22M111 75h21M68 49q-8-9 0-17t0-15M120 49q-8-9 0-17t0-15"/><path d="M155 124q-1-38 22-67M165 84q-20-9-13-23 15 4 13 23ZM170 74q20 1 20-16-15-2-20 16ZM28 122q8-22-5-42M27 99Q9 91 14 79q15 0 13 20Z"/><ellipse cx="100" cy="139" rx="68" ry="5" strokeOpacity=".3"/></> : kind === '02' ? <><path d="M39 137V68q0-25 27-29 0-14 16-17L100 8l18 14q16 3 16 17 27 4 27 29v69ZM49 137V69q0-19 25-23 0-15 16-17l10-10 10 10q16 2 16 17 25 4 25 23v68"/><path d="M31 137h138M29 144h142M37 150h126M64 137V81q0-13 15-16l21-17 21 17q15 3 15 16v56M100 49v88M72 83h20v44H72ZM108 83h20v44h-20ZM72 94h20M108 94h20"/><circle cx="92" cy="104" r="2"/><circle cx="108" cy="104" r="2"/><path d="M19 139q-6-23 1-48M19 116q-13-6-12-18 14 1 12 18ZM181 139q6-23-1-48M181 116q13-6 12-18-14 1-12 18Z"/><circle cx="100" cy="37" r="3"/></> : <><path d="M100 5v20M95 25h10M95 26q-18 10-20 24h50q-2-14-20-24M75 50l-8 14v49l12 13h42l12-13V64l-8-14M68 66h64M68 110h64M79 66v44M121 66v44M91 67v43M109 67v43M79 126v6h42v-6M93 132v8h14v-8M100 140v10"/><path d="M86 50q0-14 14-22 14 8 14 22M79 76l6 8-6 8M121 76l-6 8 6 8M96 98q-6-5 4-16 10 11 4 16ZM46 99v34M36 114h20M150 109v25M143 119h14"/><circle cx="46" cy="108" r="10" strokeOpacity=".4"/><circle cx="150" cy="115" r="8" strokeOpacity=".4"/><path d="M25 141h150M22 147h156"/></>}
  </g></svg>
}
function CornerOrnament({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth=".8"><path d="M5 95V5h90M12 88V12h76M20 70V20h50M5 48q38 0 38-43M12 64q48-4 52-52M20 85q60-5 65-65M20 20q35 0 35 35-35 0-35-35Z"/><path d="m39 39 9-5 9 5-5 9-4 8-5-8Z"/><circle cx="20" cy="20" r="4"/><circle cx="73" cy="12" r="2"/><circle cx="12" cy="73" r="2"/></g></svg>
}
function Eyebrow({ children }: { children: ReactNode }) { return <p className="nr-eyebrow">{children}</p> }
function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = ref.current
    if (!node || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    node.classList.add('nr-waiting')
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { node.classList.remove('nr-waiting'); observer.disconnect() } }, { threshold: .08 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className={`nr-reveal ${className}`}>{children}</div>
}
function Countdown() {
  const details=useInvitationDetails()
  const [now, setNow] = useState(Date.now)
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(id) }, [])
  const left = Math.max(0, (details ? new Date(weddingISO(details)).getTime() : EVENT) - now)
  return <div className="nr-countdown">{[Math.floor(left / 86400000), Math.floor(left / 3600000) % 24, Math.floor(left / 60000) % 60].map((value,i)=><div key={i}><span>{String(value).padStart(2,'0')}</span><small>{['Days','Hours','Minutes'][i]}</small></div>)}</div>
}

export default function Design8() {
  const details=useInvitationDetails()
  const groom=details?.groom || 'Zayaan'
  const bride=details?.bride || 'Aaliyah'
  const couple=details ? `${groom} & ${bride}` : 'Aaliyah & Zayaan'
  const initials=details ? `${groom[0]} & ${bride[0]}` : 'A & Z'
  const map=details ? mapURL(details.venue,details.address,details.map) : MAP
  const [phase, setPhase] = useState<'closed'|'opening'|'open'>('closed')
  const [attending, setAttending] = useState('yes')
  const [name, setName] = useState('')
  const [guests, setGuests] = useState('1')
  const [note, setNote] = useState('')
  const [diet, setDiet] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const main = useRef<HTMLElement>(null)
  useEffect(() => {
    const title = document.title
    document.title = `${couple} — Noor`
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || 'null')
      if (data && typeof data.name === 'string') {
        setName(data.name.slice(0,100)); setAttending(data.attending === 'no' ? 'no' : 'yes')
        setGuests(String(Math.max(1,Math.min(6,Number(data.guests)||1))))
        setNote(typeof data.note === 'string' ? data.note.slice(0,600) : '')
        setDiet(typeof data.diet === 'string' ? data.diet.slice(0,200) : '')
      }
    } catch { /* Browser storage is optional. */ }
    return () => { document.title = title; clearTimeout(timer.current) }
  }, [])
  useEffect(() => {
    if (phase === 'open') return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [phase])
  function open() {
    if (phase !== 'closed') return
    setPhase('opening')
    timer.current = setTimeout(() => {
      setPhase('open')
      requestAnimationFrame(() => main.current?.focus({ preventScroll: true }))
    }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1700)
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('')
    if (!name.trim()) { setError('Please enter your name.'); return }
    try {
      localStorage.setItem(KEY, JSON.stringify({ name:name.trim(),attending,guests:attending==='yes'?Number(guests):0,note:note.trim(),diet:attending==='yes'?diet.trim():'',savedAt:new Date().toISOString() }))
      setSaved(true)
    } catch { setError('Your browser could not save your reply. Please enable browser storage and try again.') }
  }
  const navigate = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  return <div className="noor">
    {phase !== 'open' && <div className={`nr-cover ${phase}`} aria-label="Wedding invitation cover">
      <div className="nr-door nr-door-left"><div className="nr-door-frame"/></div><div className="nr-door nr-door-right"><div className="nr-door-frame"/></div>
      <div className="nr-cover-content"><Eyebrow>A wedding invitation</Eyebrow><div className="nr-cover-monogram">{details ? groom[0] : "a"}<span>&</span>{details ? bride[0] : "z"}</div><div className="nr-cover-rule"/><p>Two hearts.<br/>One beautiful beginning.</p><button onClick={open} disabled={phase !== 'closed'} className="nr-open"><Star/><span>{phase === 'closed' ? 'Enter our celebration' : 'Welcome, dear guest'}</span><span aria-hidden="true">↗</span></button><small>{details ? formatDate(details.date) : "12 · 02 · 2027"}</small></div>
      <span className="nr-cover-foot">NOOR &nbsp; / &nbsp; A COURTYARD IN BLOOM</span>
    </div>}
    <main ref={main} tabIndex={-1} inert={phase !== 'open'} className="nr-main">
      <header className="nr-header"><a href="#" onClick={e=>{e.preventDefault();navigate('nr-home')}} className="nr-wordmark">noor<span>نور</span></a><span className="nr-header-center">{`THE WEDDING OF ${couple.toUpperCase()}`}</span><button onClick={()=>navigate(details ? 'nr-celebration' : 'nr-rsvp')}>{details ? 'Celebrations' : 'Kindly reply'} <span>↗</span></button></header>
      <section id="nr-home" className="nr-hero">
        <div className="nr-hero-copy"><CornerOrnament className="nr-hero-corner nr-corner-tl"/><CornerOrnament className="nr-hero-corner nr-corner-br"/><div className="nr-hero-top"><Star/><Eyebrow>In the name of Allah, the Most Merciful</Eyebrow></div><p className="nr-arabic" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p><h1>{details ? groom : bride}<span className="nr-and">&</span><span>{details ? bride : groom}</span></h1><p className="nr-hero-line">With grateful hearts,<br/>we invite you to our beginning.</p><div className="nr-date"><span>{details ? formatDate(details.date,{weekday:"long"}) : "FRIDAY"}</span><strong>{details ? details.date.slice(8,10) : "12"}</strong><span>{details ? formatDate(details.date,{month:"long"}) : "FEBRUARY"}<br/>{details ? details.date.slice(0,4) : "2027"}</span></div><button className="nr-text-link" onClick={()=>navigate('nr-invitation')}>The invitation <span>↓</span></button><span className="nr-edition">{details?.address || "HYDERABAD, INDIA"} · TOGETHER, INSHALLAH</span></div>
        <div className="nr-hero-art"><img src="/design8/courtyard.png" alt="Original watercolor of a jasmine-filled palace courtyard with carved arches, palms and a reflecting pool" fetchPriority="high"/><div className="nr-art-caption"><span>A courtyard in bloom</span><span>01 / NOOR</span></div><div className="nr-floating-note">a little joy,<br/><em>a lifetime of love.</em></div></div>
      </section>
      <div className="nr-ribbon"><span>WITH OUR FAMILIES</span><Star/><span>WITH YOUR DUAS</span><Star/><span>WITH ALL OUR LOVE</span><Star/></div>
      <section id="nr-invitation" className="nr-invitation nr-section"><Sprig className="nr-sprig nr-sprig-left"/><Sprig className="nr-sprig nr-sprig-right"/><Reveal><Eyebrow>Assalamu alaikum, dear family & friends</Eyebrow><h2>Some beginnings<br/>are a <em>blessing.</em></h2><div className="nr-small-rule"/><p className="nr-prose">{details ? details.message : <>With the blessings of Allah and the love of our families,<br className="nr-desktop"/> we joyfully invite you to witness our Nikah.<br className="nr-desktop"/> Your presence, your laughter, and your duas<br className="nr-desktop"/> will make this day truly ours.</>}</p><div className="nr-families"><div><small>THE BRIDE</small><h3>{details?.bride || "Aaliyah Ahmed"}</h3><p>{details?.brideFamily || (!details ? "Daughter of Mariam & Imran Ahmed" : "")}</p></div><Star/><div><small>THE GROOM</small><h3>{details?.groom || "Zayaan Khan"}</h3><p>{details?.groomFamily || (!details ? "Son of Saira & Farhan Khan" : "")}</p></div></div></Reveal></section>
      <section className="nr-count-section"><div><Eyebrow>A beautiful day, a little closer</Eyebrow><h2>Until we say <em>Qubool Hai.</em></h2></div><Countdown/></section>
      <section id="nr-celebration" className="nr-celebration nr-section"><Reveal className="nr-section-heading"><div><Eyebrow>The celebration</Eyebrow><h2>One day.<br/><em>A thousand memories.</em></h2></div><p>Come for the vows.<br/>Stay for the stories, the sweetness,<br/>and one more cup of chai.</p></Reveal>{details ? <Celebrations /> : <div className="nr-events">{[{n:'01',time:'3:30 PM',title:'A warm welcome',text:'Arrive, settle in, and share a little conversation over rose sherbet.'},{n:'02',time:'4:00 PM',title:'The Nikah',text:'Join our families as we make our promises and begin this new chapter.'},{n:'03',time:'6:30 PM',title:'An evening together',text:'Dinner, heartfelt toasts, and a courtyard full of the people we love.'}].map(event=><Reveal className="nr-event" key={event.n}><div className="nr-event-top"><span>{event.n}</span><span>{event.time}</span></div><div className="nr-event-icon"><CeremonyIllustration kind={event.n}/></div><h3>{event.title}</h3><p>{event.text}</p></Reveal>)}</div>}<p className="nr-schedule-note">{details ? formatDate(details.date) : "Friday, 12 February 2027 · All times in IST"}</p></section>
      <section className="nr-venue">{!details && <div className="nr-venue-art"><img src="/design8/falaknuma-courtyard.jpg" alt="Real evening photograph of the illuminated courtyard at Falaknuma Palace, Hyderabad" loading="lazy"/><div className="nr-art-label">AN EVENING AT FALAKNUMA PALACE.</div><a className="nr-photo-credit" href="https://commons.wikimedia.org/wiki/File:The_hotel_rooms_around_the_courtyard_(9918844916).jpg" target="_blank" rel="noreferrer">Photo: Tijl Vercaemer · CC BY 2.0</a></div>}<Reveal className="nr-venue-copy"><div className="nr-venue-medallion">{initials}</div><Eyebrow>The setting</Eyebrow><h2>A place for<br/><em>our forever.</em></h2><Star/><h3>{details?.venue || "Taj Falaknuma Palace"}</h3><p>{details ? details.address : <>Engine Bowli, Falaknuma<br/>Hyderabad, Telangana</>}</p><a href={map} target="_blank" rel="noreferrer" className="nr-button">Find your way <span>↗</span></a><small>{details ? `Ceremony at ${formatTime(details.time)}` : "Kindly arrive by 3:30 PM to be seated for the Nikah."}</small></Reveal></section>
      {!details && <section className="nr-details nr-section"><Reveal className="nr-section-heading"><div><Eyebrow>A few thoughtful details</Eyebrow><h2>Make yourself<br/><em>at home.</em></h2></div><Sprig className="nr-details-sprig"/></Reveal><div className="nr-detail-grid"><Reveal><span className="nr-detail-number">I.</span><h3>Dress with joy</h3><p>Festive traditional attire is warmly welcomed. Think flowing silks, embroidered details, and something that feels like you.</p><div className="nr-swatches" aria-label="Suggested colours: sage, rose, gold and emerald">{['#99a18a','#b89b91','#bb9e69','#264e40'].map(color=><span key={color} style={{background:color}}/>)}</div><small>A little colour inspiration, never a rule.</small></Reveal><Reveal><span className="nr-detail-number">II.</span><h3>Your duas are our gift</h3><p>We ask for nothing more than your presence and your prayers for a home filled with kindness, patience, and love.</p><p className="nr-detail-italic">Come with an open heart.<br/>Leave with a happy one.</p></Reveal><Reveal><span className="nr-detail-number">III.</span><h3>Be here, fully</h3><p>We would love an unplugged Nikah. Please keep your phones tucked away during the ceremony and let our photographer capture the moment.</p><small>There will be plenty of time for photos afterwards.</small></Reveal></div></section>}
      <PersonalNotes family={false}/>
      <section className="nr-quote"><div className="nr-quote-arch" aria-hidden="true"/><div className="nr-quote-stars" aria-hidden="true"><Star/><Star/><Star/><Star/><Star/></div><Star/><p>May our home be a place of<br/><em>peace, laughter, and endless kindness.</em></p><span>A LITTLE DUA FOR OUR BEGINNING</span></section>
      {!details && <section id="nr-rsvp" className="nr-rsvp nr-section"><Reveal className="nr-rsvp-intro"><Eyebrow>Your place in our story</Eyebrow><h2>It wouldn’t be<br/>the same<br/><em>without you.</em></h2><p>Please share your reply by<br/><strong>Friday, 22 January 2027.</strong></p><Sprig className="nr-rsvp-sprig"/><div className="nr-rsvp-seal"><span>WITH LOVE</span><strong>{initials}</strong><span>AND GRATITUDE</span></div></Reveal><Reveal className="nr-form-wrap"><div className="nr-paper-ribbon" aria-hidden="true"/><div className="nr-paper-heading"><span>THE FAVOUR OF YOUR REPLY</span><span>No. 120227</span></div>{saved ? <div className="nr-thanks" role="status"><Star/><Eyebrow>A little note, received on this device</Eyebrow><h3>Thank you,<br/><em>{name.trim().split(' ')[0]}.</em></h3><p>{attending==='yes'?'We look forward to a beautiful celebration together.':'You will be with us in our thoughts and duas.'}</p><p className="nr-demo">This preview saves your reply on this device only. It has not been sent to the couple.</p><button className="nr-button" onClick={()=>setSaved(false)}>Edit your reply <span>↗</span></button></div> : <form onSubmit={submit} className="nr-form"><div className="nr-form-top"><h3>A seat at our table.</h3><Star/></div><label htmlFor="nr-name">Your full name<input id="nr-name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="The name we know and love" maxLength={100} required/></label><fieldset><legend>Will you celebrate with us?</legend><div className="nr-radio-row"><label><input type="radio" name="attendance" value="yes" checked={attending==='yes'} onChange={()=>setAttending('yes')}/>Joyfully attending</label><label><input type="radio" name="attendance" value="no" checked={attending==='no'} onChange={()=>setAttending('no')}/>With you in spirit</label></div></fieldset>{attending==='yes'&&<><label htmlFor="nr-guests">Number of guests, including you<select id="nr-guests" value={guests} onChange={e=>setGuests(e.target.value)}>{[1,2,3,4,5,6].map(n=><option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}</select></label><label htmlFor="nr-diet">Any dietary needs? <span>(optional)</span><input id="nr-diet" value={diet} onChange={e=>setDiet(e.target.value)} maxLength={200} placeholder="So we can take good care of you"/></label></>}<label htmlFor="nr-note">A wish, a dua, a little love <span>(optional)</span><textarea id="nr-note" value={note} onChange={e=>setNote(e.target.value)} placeholder="Leave a few words for our beginning…" rows={3} maxLength={600}/></label><p className="nr-demo">Preview invitation · Your reply is saved on this device only.</p>{error&&<p role="alert" className="nr-error">{error}</p>}<button type="submit" className="nr-button">Save my reply <span>↗</span></button></form>}</Reveal></section>}
      <footer className="nr-footer"><Star/><p>Until we meet<br/><em>in the courtyard.</em></p><Sprig className="nr-footer-flora nr-footer-flora-left"/><Sprig className="nr-footer-flora nr-footer-flora-right"/><div className="nr-footer-names">{couple}</div><div className="nr-footer-bottom"><span>{details ? formatDate(details.date) : "12 FEBRUARY 2027 · HYDERABAD"}</span><span>NOOR — AN ORIGINAL INVITATION</span><button onClick={()=>navigate('nr-home')}>Back to the beginning ↑</button></div>{!details && <small>Original concept · Sample names, venue and event details</small>}</footer>
      <nav className="nr-mobile-nav" aria-label="Invitation shortcuts"><button onClick={()=>navigate('nr-celebration')}>The day</button><Star/><button onClick={()=>navigate('nr-rsvp')}>RSVP ↗</button></nav>
    </main>
    <div className="nr-grain" aria-hidden="true"/>
    <div className="nr-petals" aria-hidden="true">{Array.from({length:8},(_,i)=><i key={i} style={{'--i':i} as CSSProperties}/>)}</div>
  </div>
}
