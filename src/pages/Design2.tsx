import { useEffect, useRef, useState } from 'react'
import './Design2.css'
import HeartDateReveal from './HeartDateReveal'
import FlowerTrail from './FlowerTrail'

const ASSETS = '/images/royal-grace/'
const eventDate = new Date('2026-09-27T17:00:00-04:00')
const venue = 'Islamic Center of Melville'
const address = '118 Old East Neck Road, Melville, NY 11747'

function Divider() { return <div className="rg-divider" aria-hidden="true"><span />✧<span /></div> }

function Countdown() {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const id = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const diff = Math.max(0, eventDate.getTime() - now)
  if (!diff) return <p className="rg-script rg-celebrate">A day to remember, a love forever.</p>
  const values = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60]
  return <div className="rg-countdown">{values.map((v, i) => <div key={i}><strong>{String(v).padStart(2, '0')}</strong><small>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</small></div>)}</div>
}

export default function Design2() {
  const video = useRef<HTMLVideoElement>(null)
  const audio = useRef<HTMLAudioElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [opened, setOpened] = useState(false)
  const [namesVisible, setNamesVisible] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState(false)

  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Zohan & Rose — Royal Grace'
    return () => { clearTimeout(timer.current); document.title = previousTitle }
  }, [])

  function playMusic() {
    const player = audio.current
    if (!player) return
    player.volume = 0.4
    void player.play().catch(() => {})
  }

  function openInvitation() {
    setOpened(true)
    playMusic()
    if (videoFailed || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setNamesVisible(true); return }
    video.current?.play().catch(() => { setVideoFailed(true); setNamesVisible(true) })
    timer.current = setTimeout(() => setNamesVisible(true), 6000)
  }

  return <main className="royal-grace">
    <FlowerTrail />
    <audio ref={audio} src={`${ASSETS}music.mp3`} loop preload="auto" />
    <section className={`rg-hero ${namesVisible ? 'rg-is-open' : ''}`} aria-label="Wedding invitation">
      {!videoFailed && <video ref={video} src={`${ASSETS}opening.mp4`} muted playsInline preload="auto" onError={() => { setVideoFailed(true); if (opened) setNamesVisible(true) }} onEnded={() => setNamesVisible(true)} />}
      <div className="rg-hero-shade" />
      {!opened && <button className="rg-open" onClick={openInvitation} aria-label="Open your invitation" />}
      <div className="rg-names" aria-hidden={!namesVisible}>
        <span className="rg-heart">♥</span><p className="rg-script">We’re getting married</p><Divider />
        <h1><span>Zohan</span><i>&</i><span>Rose</span></h1>
        <p className="rg-eyebrow">Together, with our families</p>
      </div>
      {namesVisible && <a className="rg-scroll" href="#rg-welcome" onClick={e => {
        e.preventDefault()
        document.getElementById('rg-welcome')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start',
        })
      }}>SCROLL TO DISCOVER<span>⌄</span></a>}
    </section>

    {opened && <div className="rg-paper" id="rg-welcome">
      <section className="rg-section rg-welcome"><p className="rg-eyebrow">An invitation from the heart</p><Divider /><h2 className="rg-script">Two souls. One beautiful journey.</h2><p>With the blessings of Allah and the love of our families, we invite you to celebrate the beginning of our forever.</p><p>Your presence, your prayers, and your love will make our day complete.</p><Divider /><span className="rg-signature rg-script">Zohan & Rose</span></section>
      <section className="rg-section"><p className="rg-eyebrow">A moment made for us</p><h2 className="rg-script">Save our date</h2><HeartDateReveal /></section>
      <section className="rg-section"><Divider /><p className="rg-eyebrow">Every moment brings us closer</p><h2 className="rg-script">Until our forever</h2><Countdown /><Divider /></section>
      <section className="rg-section"><p className="rg-eyebrow">Love, laughter & happily ever after</p><h2 className="rg-script">The celebration</h2><div className="rg-timeline">{[['5:00 PM', 'A warm welcome', 'Arrival of our beloved family & friends'], ['6:00 PM', 'The Nikkah', 'Two hearts, one promise'], ['7:00 PM', 'Mocktails & mingling', 'A little laughter, a little sparkle'], ['8:00 PM', 'Dinner together', 'Good food and beautiful company'], ['9:00 PM', 'Let’s celebrate', 'An evening of joyful memories']].map(([time, title, detail]) => <div className="rg-event" key={time}><time>{time}</time><span aria-hidden="true">✧</span><div><h3>{title}</h3><p>{detail}</p></div></div>)}</div></section>
      <section className="rg-section"><Divider /><p className="rg-eyebrow">Where memories will bloom</p><h2 className="rg-script">The venue</h2><img className="rg-venue" src="/images/venue.png" alt="Islamic Center of Melville" loading="lazy" /><h3>{venue}</h3><p>{address}</p><a className="rg-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue + ' ' + address)}`} target="_blank" rel="noreferrer">View directions ↗</a></section>
      <section className="rg-section rg-notes"><Divider /><h2 className="rg-script">A little note</h2><h3>Dress beautifully, celebrate comfortably</h3><p>We kindly ask our guests to avoid deep red and maroon attire.</p><h3>Your presence is our present</h3><p>With love, we request no boxed gifts.</p><Divider /></section>
      <section className="rg-section"><p className="rg-eyebrow">We’ve saved a place for you</p><h2 className="rg-script">With love, RSVP</h2><p>Please let us know if you’ll be celebrating with us.</p><p className="rg-demo-note">Preview form · responses are saved only on this device.</p>
        {saved ? <div className="rg-confirmation" role="status"><span>♡</span><h3>Your response is saved on this device.</h3><p>Thank you for trying our invitation preview.</p><button className="rg-text-button" onClick={() => setSaved(false)}>Edit response</button></div> : <form className="rg-form" onSubmit={e => { e.preventDefault(); const values = Object.fromEntries(new FormData(e.currentTarget)); try { localStorage.setItem('royal-grace-rsvp', JSON.stringify(values)); setSaved(true); setSaveError(false) } catch { setSaveError(true) } }}>
          <label>Your name<input name="name" autoComplete="name" placeholder="Full name" required maxLength={120} /></label>
          <label>Will you join us?<select name="attendance"><option value="yes">Joyfully accepts</option><option value="no">Regretfully declines</option></select></label>
          <label>A wish for the couple<textarea name="message" placeholder="Send a little love…" rows={3} maxLength={1000} /></label>
          {saveError && <p role="alert">Your browser could not save the response. Please enable local storage and try again.</p>}
          <button className="rg-button" type="submit">Save my response ♡</button>
        </form>}
      </section>
      <footer className="rg-ending"><p className="rg-eyebrow">The beginning of always</p><h2 className="rg-script">Forever & ever</h2><Divider /><p>We can’t wait to share this beautiful day with you.</p><span className="rg-script">Zohan & Rose</span><p className="rg-eyebrow">27 SEPTEMBER 2026</p></footer>
    </div>}
  </main>
}
