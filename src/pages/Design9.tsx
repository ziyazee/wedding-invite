import { useEffect, useRef, useState } from 'react'
import { useInvitationDetails } from '../invitations/context'
import { formatDate, formatTime, mapURL, weddingISO, type InvitationData } from '../invitations/model'
import { downloadCalendar } from '../invitations/calendar'
import './Design9.css'

const sample: InvitationData = {
 template:9,groom:'Mohad',bride:'Rahma',date:'2026-12-20',time:'11:00',offset:'+05:30',venue:'TMA Pai Convention Centre',address:'Mangalore',map:'',
 message:'With the blessings of Allah and the love of our families, we invite you to celebrate the beginning of our forever.',groomFamily:'',brideFamily:'',dressCode:'',giftNote:'',music:'/bisara.mp3',gallery:'',
 events:[
 {title:'Mehendi Programme',date:'2026-12-17',time:'11:00',venue:'Silvergate Homestay',address:'Chikmagaluru',map:'https://maps.app.goo.gl/uaSHaAyVXCriCCrw5'},
 {title:'Mehendi Mehfil',date:'2026-12-19',time:'17:00',venue:'Royal Garden Beach Resort',address:'Ullal, Mangalore',map:'https://maps.app.goo.gl/43ui6W3Hn6N2cbui8'},
 {title:'Nikah & Wedding',date:'2026-12-20',time:'11:00',venue:'TMA Pai Convention Centre',address:'Mangalore',map:'https://maps.app.goo.gl/1xf3k59k9QEaoQ717'},
 {title:'Wedding Reception',date:'2026-12-21',time:'19:00',venue:'Shoolin Palace',address:'Airport Road, Mangalore',map:'https://maps.app.goo.gl/ARcdN5shsLC5og2f8'},
 {title:'Bride’s Reception',date:'2026-12-24',time:'11:00',venue:'Heritage Convention Hall',address:'Chikmagaluru',map:'https://maps.app.goo.gl/NbvAqoYtcacD5Xas6'}]
}
function Ornament(){return <div className="sv-ornament" aria-hidden="true"><span/>❧<span/></div>}
export default function Design9(){
 const personal=useInvitationDetails();const d=personal||sample
 const audio=useRef<HTMLAudioElement>(null);const root=useRef<HTMLElement>(null)
 const phase = 'open';const [playing,setPlaying]=useState(false);const [now,setNow]=useState(Date.now())
 useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[])
 useEffect(()=>{if(phase!=='open')return;const nodes=root.current?.querySelectorAll('.sv-reveal');if(!nodes||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('sv-visible');observer.unobserve(e.target)}}),{threshold:.12});nodes.forEach(n=>{n.classList.add('sv-observed');observer.observe(n)});return()=>observer.disconnect()},[phase])
 const remaining=Math.max(0,new Date(weddingISO(d)).getTime()-now)
 const counts=[Math.floor(remaining/86400000),Math.floor(remaining/3600000)%24,Math.floor(remaining/60000)%60,Math.floor(remaining/1000)%60]
 return <main ref={root} className={`sv-invitation sv-${phase}`}>
 {d.music&&<><audio ref={audio} src={d.music} preload="none" loop onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>{<button className="sv-music" aria-label={playing?'Pause music':'Play music'} onClick={()=>playing?audio.current?.pause():void audio.current?.play().catch(()=>{})}>{playing?'Ⅱ':'♫'}</button>}</>}
 <section className="sv-hero" aria-label="Wedding invitation">
 <img className="sv-open-still" src="/design9/curtain-open.jpg" alt="An embroidered ivory and gold wedding arch"/>
 {phase==='open'&&<div className="sv-hero-copy"><p className="sv-eyebrow">TOGETHER, BY THE GRACE OF ALLAH</p><h1><span>{d.groom}</span><i>&</i><span>{d.bride}</span></h1><Ornament/><p className="sv-hero-date">{formatDate(d.date)}</p><p>{d.address}</p><button className="sv-scroll" onClick={()=>document.getElementById('sv-story')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}>THE INVITATION <span>↓</span></button></div>}
 </section>
 {phase==='open'&&<div className="sv-body">
 <section id="sv-story" className="sv-story sv-reveal"><p className="sv-arabic" lang="ar" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p><p className="sv-eyebrow">IN THE NAME OF ALLAH, THE MOST MERCIFUL</p><Ornament/><h2>Written in the stars.<br/><em>Held in our hearts.</em></h2><p className="sv-prose">{d.message||sample.message}</p>{(d.groomFamily||d.brideFamily)&&<div className="sv-families">{d.groomFamily&&<p><small>GROOM’S FAMILY</small>{d.groomFamily}</p>}{d.brideFamily&&<p><small>BRIDE’S FAMILY</small>{d.brideFamily}</p>}</div>}<Ornament/></section>
 <section className="sv-countdown sv-reveal"><p className="sv-eyebrow">{remaining?'EVERY MOMENT BRINGS US CLOSER':'OUR BEAUTIFUL BEGINNING'}</p><div>{counts.map((n,i)=><p key={i}><strong>{String(n).padStart(2,'0')}</strong><span>{['DAYS','HOURS','MINUTES','SECONDS'][i]}</span></p>)}</div><p className="sv-count-caption">Until we begin our forever</p></section>
 <section className="sv-celebrations"><header className="sv-reveal"><span className="sv-eyebrow">THE WEDDING CHAPTERS</span><h2>Days of joy.<br/><em>A lifetime of love.</em></h2><Ornament/><p>Join us for the moments we will cherish.</p></header>
 {d.events.map((e,i)=><article key={i} className={`sv-event sv-reveal ${/nikah|wedding$/i.test(e.title)?'sv-event-featured':''}`}><div className="sv-event-index"><span>CHAPTER {String(i+1).padStart(2,'0')}</span><span>✧</span></div><h3>{e.title}</h3><div className="sv-event-date"><strong>{formatDate(e.date,{day:'2-digit'})}</strong><div><span>{formatDate(e.date,{month:'long',year:'numeric'})}</span><small>{formatDate(e.date,{weekday:'long'})} · {formatTime(e.time)}</small></div></div><div className="sv-event-venue"><h4>{e.venue}</h4><p>{e.address}</p></div><div className="sv-event-actions"><a href={mapURL(e.venue,e.address,e.map)} target="_blank" rel="noreferrer">Directions <span>↗</span></a><button onClick={()=>downloadCalendar(e,d.offset,`${d.groom} & ${d.bride}`)}>Save the date <span>+</span></button></div></article>)}
 </section>
 {(d.dressCode||d.giftNote||d.gallery)&&<section className="sv-notes sv-reveal">{d.dressCode&&<><p className="sv-eyebrow">DRESS CODE</p><p>{d.dressCode}</p></>}{d.giftNote&&<><p className="sv-eyebrow">A LITTLE NOTE</p><p>{d.giftNote}</p></>}{d.gallery&&<a href={d.gallery} target="_blank" rel="noreferrer">Our captured memories ↗</a>}</section>}
 <footer className="sv-footer sv-reveal"><Ornament/><p>Your presence, your prayers, and your love<br/>will make our day complete.</p><h2>{d.groom}<i> & </i>{d.bride}</h2><span className="sv-eyebrow">WITH LOVE, ALWAYS</span><span className="sv-footer-flower" aria-hidden="true">❧</span></footer>
 </div>}
 </main>
}
