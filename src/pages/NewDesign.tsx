import PersonalNotes from '../invitations/PersonalNotes'
import '../invitations/personalized.css'
import { useInvitationDetails } from '../invitations/context';
import { formatDate, formatTime, mapURL, weddingISO } from '../invitations/model';
import Celebrations from '../invitations/Celebrations';
import { useState, useEffect, useRef } from 'react';

// ─── Data ───
const COUPLE = { groom: 'Zohan', bride: 'Rose' };
const WEDDING_DATE = '2026-09-27';
const VENUE = { name: 'Islamic Center of Melville', address: '118 Old East Neck Road, Melville, NY 11747' };
const EVENTS = [
  { name: 'Guest Arrival', time: '5 PM' },
  { name: 'Nikkah Ceremony', time: '6 PM' },
  { name: 'Mocktail Hour', time: '7 PM' },
  { name: 'Dinner', time: '8 PM' },
  { name: 'Dance', time: '9 PM' },
];
const RSVP_DEADLINE = 'August 09';

// ─── Palette (matching reference site) ───
const C = {
  pageBg: '#faf7f2',
  cardBg: '#ffffff',
  text: '#3a2f28',
  textSoft: '#6d5d52',
  textFaint: '#a09080',
  gold: '#b08c3e',
  goldDim: 'rgba(176,140,62,0.2)',
  rose: '#7a2e3a',
  roseSoft: '#a8646f',
};

const F = {
  script: "'Great Vibes', cursive",
  serif: "'Playfair Display', serif",
  body: "'Lora', serif",
};

// ─── Scroll-triggered fade-in ───
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, vis } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(35px)',
      transition: `opacity 0.85s ease ${delay}ms, transform 0.85s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── Splash Screen ───
// Uses the real envelope image + the real opening video from the reference.
// Tap → image fades out → video fades in & plays → video ends → fades out → page.

function Splash({ onOpen }: { onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState<'image' | 'video' | 'ending'>('image');

  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);

  function handleTap() {
    if (phase !== 'image') return;
    setPhase('video');
    const vid = videoRef.current;
    if (vid) { vid.currentTime = 0; vid.play().catch(() => {}); }
  }

  function handleVideoEnd() {
    setPhase('ending');
    setTimeout(onOpen, 1400);
  }

  return (
    <div
      onClick={phase === 'image' ? handleTap : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        cursor: phase === 'image' ? 'pointer' : 'default',
        background: '#e5ddd0',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes tapPulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
      `}</style>

      {/* Background that matches envelope edges */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(170deg, #ede6d8, #e0d8c8)',
        opacity: phase === 'ending' ? 0 : 1,
        transition: 'opacity 1.4s ease',
      }} />

      {/* Layer 1: Envelope image */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: ready && phase === 'image' ? 1 : 0,
        transition: 'opacity 1.4s ease',
        pointerEvents: phase === 'image' ? 'auto' : 'none',
      }}>
        <img
          src="/images/envelope.png"
          alt="Open your invitation"
          draggable={false}
          style={{
            maxWidth: '100%', height: '100vh', maxHeight: '100vh',
            width: 'auto', objectFit: 'contain' as const,
          }}
        />
      </div>

      {/* Layer 2: Video */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        opacity: phase === 'video' ? 1 : phase === 'ending' ? 0 : 0,
        transition: phase === 'ending' ? 'opacity 1.4s ease' : 'opacity 0.8s ease',
        pointerEvents: 'none',
      }}>
        <video
          ref={videoRef}
          src="/images/envelope-open.mp4"
          muted
          playsInline
          preload="metadata"
          onEnded={handleVideoEnd}
          style={{
            width: '100%', maxWidth: '440px',
            display: 'block', objectFit: 'contain' as const,
          }}
        />
      </div>
    </div>
  );
}

// ─── Dividers ───
function GoldDivider({ width = 180 }: { width?: number }) {
  return (
    <svg width={width} height="18" viewBox={`0 0 ${width} 18`} fill="none" style={{ display: 'block', margin: '1.25rem auto' }}>
      <line x1="0" y1="9" x2={width * 0.38} y2="9" stroke={C.goldDim} strokeWidth="0.5" />
      <line x1={width * 0.62} y1="9" x2={width} y2="9" stroke={C.goldDim} strokeWidth="0.5" />
      <path d={`M${width / 2} 1 L${width / 2 + 7} 9 L${width / 2} 17 L${width / 2 - 7} 9 Z`} fill="none" stroke={C.gold} strokeWidth="0.6" />
      <circle cx={width * 0.38 + 6} cy="9" r="1.2" fill={C.gold} opacity="0.4" />
      <circle cx={width * 0.62 - 6} cy="9" r="1.2" fill={C.gold} opacity="0.4" />
    </svg>
  );
}

// ─── Countdown ───
function Countdown() {
  const details = useInvitationDetails();
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const diff = Math.max(0, new Date(details ? weddingISO(details) : WEDDING_DATE + 'T17:00:00').getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      {[{ v: d, l: 'Days' }, { v: h, l: 'Hours' }, { v: m, l: 'Minutes' }, { v: s, l: 'Seconds' }].map((b) => (
        <div key={b.l} style={{ textAlign: 'center' }}>
          <div style={{
            width: '68px', height: '68px', borderRadius: '12px',
            background: C.cardBg, border: `1px solid ${C.goldDim}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          }}>
            <span style={{ fontFamily: F.serif, fontSize: '1.55rem', fontWeight: 700, color: C.gold }}>
              {String(b.v).padStart(2, '0')}
            </span>
          </div>
          <p style={{ fontFamily: F.body, fontSize: '0.58rem', color: C.textFaint, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '6px' }}>
            {b.l}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Timeline ───
function Timeline() {
  return (
    <div style={{ maxWidth: '280px', margin: '0 auto', position: 'relative' }}>
      <div style={{
        position: 'absolute', left: '14px', top: 8, bottom: 8, width: '1px',
        background: `linear-gradient(to bottom, transparent, ${C.gold}40 10%, ${C.gold}40 90%, transparent)`,
      }} />
      {EVENTS.map((ev, i) => (
        <FadeIn key={i} delay={i * 100}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 0', position: 'relative' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
              background: C.cardBg, border: `1.5px solid ${C.gold}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 0 4px ${C.pageBg}, 0 0 0 5px ${C.goldDim}`,
              zIndex: 1,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.gold }} />
            </div>
            <div>
              <p style={{ fontFamily: F.serif, fontSize: '0.92rem', color: C.text, fontWeight: 600, margin: 0 }}>{ev.name}</p>
              <p style={{ fontFamily: F.body, fontSize: '0.78rem', color: C.textSoft, margin: '1px 0 0' }}>{ev.time}</p>
            </div>
          </div>
        </FadeIn>
      ))}
    </div>
  );
}

// ─── RSVP ───
function Rsvp() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [att, setAtt] = useState<'' | 'yes' | 'no'>('');
  const [guests, setGuests] = useState('1');
  const [song, setSong] = useState('');
  const [kids, setKids] = useState('');
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !att) return;
    try {
      const k = 'rsvp_sacred_garden';
      const ex = JSON.parse(localStorage.getItem(k) || '[]');
      ex.push({ name, att, guests: +guests, song, kids, at: new Date().toISOString() });
      localStorage.setItem(k, JSON.stringify(ex));
    } catch { /* */ }
    setDone(true);
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: `1px solid ${C.goldDim}`, background: C.cardBg,
    color: C.text, fontFamily: F.body, fontSize: '0.85rem',
    outline: 'none', boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    fontFamily: F.body, fontSize: '0.65rem', color: C.textFaint,
    letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '5px', display: 'block',
  };

  if (!open) {
    return (
      <div style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setOpen(true)}>
        <img src="/images/wax-seal.png" alt="RSVP" style={{ width: '90px', height: '90px', objectFit: 'contain', margin: '0 auto', display: 'block' }} />
        <p style={{
          fontFamily: F.body, fontSize: '0.65rem', color: C.textFaint,
          letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '12px',
          animation: 'tapPulse 2.5s ease-in-out infinite',
        }}>
          Tap to RSVP
        </p>
        <style>{`@keyframes tapPulse { 0%,100% { opacity:.4 } 50% { opacity:1 } }`}</style>
      </div>
    );
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem 0' }}>
        <p style={{ fontFamily: F.script, fontSize: '2rem', color: C.gold }}>Thank You!</p>
        <p style={{ fontFamily: F.body, fontSize: '0.85rem', color: C.textSoft, marginTop: '0.5rem' }}>
          Your RSVP has been received. We look forward to celebrating with you.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      background: C.cardBg, borderRadius: '16px', border: `1px solid ${C.goldDim}`,
      padding: '1.5rem 1.25rem', maxWidth: '350px', margin: '0 auto',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)', animation: 'scaleIn .35s ease',
    }}>
      <style>{`@keyframes scaleIn { from { opacity:0; transform:scale(.96) } to { opacity:1; transform:scale(1) } }`}</style>
      <p style={{ ...lbl, textAlign: 'center', marginBottom: '1.25rem' }}>Kindly reply before {RSVP_DEADLINE}</p>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div><label style={lbl}>Your Name</label><input style={inp} placeholder="Full name" value={name} onChange={e => setName(e.target.value)} /></div>
        <div>
          <label style={lbl}>Attendance</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {([['yes', 'Accepts with pleasure'], ['no', 'Declines with regret']] as const).map(([v, l]) => (
              <button key={v} type="button" onClick={() => setAtt(v)} style={{
                flex: 1, padding: '10px 4px', borderRadius: '10px', fontSize: '0.72rem',
                border: `1px solid ${att === v ? C.gold : C.goldDim}`,
                background: att === v ? C.gold : C.cardBg,
                color: att === v ? '#fff' : C.textSoft, fontFamily: F.body, cursor: 'pointer', transition: 'all .25s',
              }}>{l}</button>
            ))}
          </div>
        </div>
        {att === 'yes' && (<>
          <div><label style={lbl}>Number of Guests</label><input type="number" min="1" max="20" style={inp} value={guests} onChange={e => setGuests(e.target.value)} /></div>
          <div><label style={lbl}>A Song That Gets You Dancing</label><input style={inp} placeholder="Your song request" value={song} onChange={e => setSong(e.target.value)} /></div>
          <div><label style={lbl}>Children Attending (names &amp; ages)</label><textarea style={{ ...inp, resize: 'none' as const, minHeight: '50px' }} placeholder="Names and ages" value={kids} onChange={e => setKids(e.target.value)} /></div>
        </>)}
        <button type="submit" style={{
          padding: '12px', borderRadius: '10px', border: 'none',
          background: C.gold, color: '#fff', fontFamily: F.body,
          fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.1em',
          textTransform: 'uppercase', cursor: 'pointer',
        }}>Send RSVP</button>
      </form>
    </div>
  );
}

// ─── Section heading helper ───
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: F.script, fontSize: '2rem', color: C.gold, margin: '0.5rem 0 1.25rem' }}>{children}</p>;
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p style={{ fontFamily: F.body, fontSize: '0.65rem', color: C.textFaint, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>{children}</p>;
}

// ═══════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════
export default function NewDesign() {
  const details = useInvitationDetails();
  const couple = details ? {groom:details.groom,bride:details.bride} : COUPLE;
  const venue = details ? {name:details.venue,address:details.address} : VENUE;
  const [splashOpen, setSplashOpen] = useState(true);

  useEffect(() => {
    document.body.style.overflow = splashOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [splashOpen]);

  return (
    <div style={{ background: C.pageBg, color: C.text, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`* { box-sizing: border-box; margin: 0; }`}</style>

      {/* ═══ Splash ═══ */}
      {splashOpen && <Splash onOpen={() => setSplashOpen(false)} />}

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>

        {/* ═══ Top decoration ═══ */}
        <FadeIn delay={150}>
          <img src="/images/decor-top.png" alt="" style={{ width: '100%', maxWidth: '320px', margin: '2rem auto 0', display: 'block', opacity: 0.9 }} />
        </FadeIn>

        {/* ═══ Couple Names + Date ═══ */}
        <FadeIn delay={250}>
          <div style={{ padding: '1rem 0 0' }}>
            <Caption>Together with their families</Caption>
            <GoldDivider width={140} />

            <h1 style={{ fontFamily: F.script, fontSize: 'clamp(3rem, 10vw, 4.5rem)', color: C.rose, lineHeight: 1.1, margin: '0.3rem 0' }}>
              {couple.groom}
            </h1>
            <p style={{ fontFamily: F.script, fontSize: '1.5rem', color: C.textFaint }}>&amp;</p>
            <h1 style={{ fontFamily: F.script, fontSize: 'clamp(3rem, 10vw, 4.5rem)', color: C.rose, lineHeight: 1.1, margin: '0.3rem 0' }}>
              {couple.bride}
            </h1>

            {/* Rose image */}
            <img src="/images/rose-left.png" alt="" style={{ width: '140px', margin: '1rem auto', display: 'block', opacity: 0.85 }} />

            <p style={{ fontFamily: F.serif, fontSize: '0.9rem', color: C.textSoft }}>Wedding Day</p>
            <p style={{ fontFamily: F.serif, fontSize: '1.3rem', color: C.gold, fontWeight: 600, margin: '0.15rem 0 0.5rem' }}>
              {details ? formatDate(details.date) : "27 . 09 . 26"}
            </p>
            <GoldDivider />
          </div>
        </FadeIn>

        {/* ═══ Tagline ═══ */}
        <FadeIn>
          <div style={{ padding: '2rem 0.5rem' }}>
            <p style={{ fontFamily: F.script, fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: C.rose, lineHeight: 1.5 }}>
              Two Souls, One Destiny
            </p>
            <p style={{ fontFamily: F.script, fontSize: 'clamp(1.6rem, 5vw, 2.2rem)', color: C.rose, lineHeight: 1.5 }}>
              A Lifetime written by God
            </p>
          </div>
        </FadeIn>

        {/* ═══ Welcome ═══ */}
        <FadeIn>
          <div style={{ padding: '1.5rem 0' }}>
            <GoldDivider />
            <p style={{ fontFamily: F.body, fontSize: '0.9rem', color: C.textSoft, lineHeight: 1.85, margin: '1rem auto', maxWidth: '340px' }}>
              Dear Friends and Family,
              <br /><br />
              {details?.message || "Join us for an evening of love, laughter, duas, and unforgettable memories as we begin our forever."}
            </p>
            <GoldDivider />
          </div>
        </FadeIn>

        {/* ═══ Countdown ═══ */}
        <FadeIn>
          <div style={{ padding: '2rem 0' }}>
            <img src="/images/decor-countdown.png" alt="" style={{ width: '100%', maxWidth: '280px', margin: '0 auto 1rem', display: 'block', opacity: 0.85 }} />
            <SectionTitle>The Celebration Begins In</SectionTitle>
            <Countdown />
          </div>
        </FadeIn>

        {/* ═══ Left/Right floral decorations + Schedule ═══ */}
        <FadeIn>
          <div style={{ padding: '2rem 0', position: 'relative' }}>
            <img src="/images/left-element.png" alt="" style={{ position: 'absolute', left: '-30px', top: '30px', width: '60px', opacity: 0.5 }} />
            <img src="/images/right-element.png" alt="" style={{ position: 'absolute', right: '-30px', top: '30px', width: '60px', opacity: 0.5 }} />
            <SectionTitle>Schedule of Events</SectionTitle>
            <img src="/images/decor-events1.png" alt="" style={{ width: '100%', maxWidth: '240px', margin: '0 auto 1rem', display: 'block', opacity: 0.8 }} />
            {details ? <Celebrations /> : <Timeline />}
            <img src="/images/decor-events2.png" alt="" style={{ width: '100%', maxWidth: '240px', margin: '1.5rem auto 0', display: 'block', opacity: 0.8 }} />
          </div>
        </FadeIn>

        {/* ═══ Venue ═══ */}
        <FadeIn>
          <div style={{ padding: '2rem 0' }}>
            <GoldDivider />
            <Caption>Venue</Caption>
            <h3 style={{ fontFamily: F.serif, fontSize: '1.25rem', color: C.text, fontWeight: 600, margin: '0.25rem 0' }}>{venue.name}</h3>
            <p style={{ fontFamily: F.body, fontSize: '0.85rem', color: C.textSoft, lineHeight: 1.6 }}>{venue.address}</p>
            {!details && <img src="/images/venue.png" alt="Venue" style={{
              width: '100%', borderRadius: '12px', marginTop: '1rem',
              border: `1px solid ${C.goldDim}`, boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }} />}
            {details && <a href={mapURL(details.venue,details.address,details.map)} target="_blank" rel="noreferrer">Directions ↗</a>}
            <GoldDivider />
          </div>
        </FadeIn>

        {/* ═══ Guest Guidelines ═══ */}
        <FadeIn>
          <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(details ? [{img:'/images/decor-gift.png',title:'Gift note',text:details.giftNote},{img:'/images/decor-dress.png',title:'Dress code',text:details.dressCode}].filter(g=>g.text) : [
              { img: '/images/decor-gift.png', title: 'Gift Preference', text: 'Kindly, no boxed gifts please.' },
              { img: '/images/decor-dress.png', title: 'Dress Code', text: 'We kindly ask guests to avoid deep red and maroon attire for the celebration.' },
            ]).map((g) => (
              <div key={g.title} style={{
                background: C.cardBg, borderRadius: '14px', border: `1px solid ${C.goldDim}`,
                padding: '1.25rem', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}>
                <img src={g.img} alt="" style={{ width: '60px', height: '60px', objectFit: 'contain', margin: '0 auto 0.6rem', display: 'block', borderRadius: '50%' }} />
                <p style={{ fontFamily: F.body, fontSize: '0.65rem', color: C.gold, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>{g.title}</p>
                <p style={{ fontFamily: F.body, fontSize: '0.82rem', color: C.textSoft, lineHeight: 1.6 }}>{g.text}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* ═══ RSVP ═══ */}
        <FadeIn>
          <div style={{ padding: '2rem 0' }}>
            <GoldDivider width={120} />
            <SectionTitle>RSVP</SectionTitle>
            {details ? <p>{formatDate(details.date)} · {formatTime(details.time)}</p> : <Rsvp />}
          </div>
        </FadeIn>

        <PersonalNotes notes={false}/>
        {/* ═══ Closing ═══ */}
        <FadeIn>
          <div style={{ padding: '2.5rem 0 4rem' }}>
            <img src="/images/closing.jpg" alt="" style={{
              width: '100%', maxWidth: '280px', borderRadius: '14px', margin: '0 auto 1.5rem', display: 'block',
              border: `1px solid ${C.goldDim}`, boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }} />
            <img src="/images/rose-right.png" alt="" style={{ width: '100px', margin: '0 auto 1rem', display: 'block', opacity: 0.75 }} />
            <GoldDivider />
            <p style={{ fontFamily: F.body, fontSize: '0.82rem', color: C.textSoft, margin: '1rem 0 0.4rem' }}>
              Hope to see you there!
            </p>
            <p style={{ fontFamily: F.script, fontSize: '2.2rem', color: C.rose }}>
              {couple.groom} &amp; {couple.bride}
            </p>
            <GoldDivider />
          </div>
        </FadeIn>

      </div>
    </div>
  );
}
