/* Kerala Dawn -- Main Template Component
   Cinematic Kerala Hindu wedding invitation with dawn progression.
   Includes ambient fireflies, backwater waves, elephant procession,
   and section light bleeds. */

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { sampleWedding } from './data/sample'
import { Fireflies, BackwaterWaves, ElephantProcession } from './assets'
import Opening from './sections/Opening'
import Couple from './sections/Couple'
import Countdown from './sections/Countdown'
import Celebrations from './sections/Celebrations'
import RSVP from './sections/RSVP'
import Closing from './sections/Closing'
import './styles/main.css'

// Register GSAP plugins once at module scope
gsap.registerPlugin(ScrollTrigger, useGSAP)

const VIDEO_SRC = '/templates/kerala-dawn/kerala.mp4'

export default function KeralaDawn() {
  const data = sampleWedding
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const coupleSectionRef = useRef<HTMLElement>(null)
  const processionRef = useRef<HTMLDivElement>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const startMusic = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 4
    audio.volume = 0.35
    void audio.play().catch(() => {})
  }

  // Refresh ScrollTrigger positions after fonts load
  useEffect(() => {
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh()
    })
  }, [])

  // Elephant procession scroll reveal
  useGSAP(
    () => {
      if (prefersReducedMotion || !processionRef.current) {
        if (processionRef.current) {
          gsap.set(processionRef.current.querySelectorAll('.kd-procession__left, .kd-procession__center, .kd-procession__right'), {
            opacity: 1,
          })
        }
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: processionRef.current,
          start: 'top 85%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      })

      // Left elephant walks in from left
      tl.fromTo(
        processionRef.current.querySelector('.kd-procession__left'),
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8 },
        0
      )

      // Center elephant fades up
      tl.fromTo(
        processionRef.current.querySelector('.kd-procession__center'),
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.15
      )

      // Right elephant walks in from right
      tl.fromTo(
        processionRef.current.querySelector('.kd-procession__right'),
        { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 0.8 },
        0.3
      )
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="kd-page">
      <audio ref={audioRef} src="/templates/kerala/assets/music.mp3" loop preload="none" onPlay={() => setMusicPlaying(true)} onPause={() => setMusicPlaying(false)} />
      <button className="kd-music" type="button" aria-label={musicPlaying ? 'Pause music' : 'Play music'} onClick={() => {
        const audio = audioRef.current
        if (!audio) return
        if (audio.paused) {
          audio.volume = 0.35
          void audio.play().catch(() => {})
        } else audio.pause()
      }}>{musicPlaying ? 'Ⅱ' : '♫'}</button>
      {/* Ambient fireflies -- page-level floating particles */}
      {!prefersReducedMotion && (
        <Fireflies className="kd-fireflies-layer" count={12} />
      )}

      <Opening
        couple={data.couple}
        weddingDate={data.weddingDate}
        videoSrc={VIDEO_SRC}
        videoRef={videoRef}
        coupleSectionRef={coupleSectionRef}
        onBegin={startMusic}
      />

      {/* Backwater waves divider: Opening -> Couple */}
      <div className="kd-water-ripple-divider">
        <BackwaterWaves />
      </div>

      {/* Wrap Couple in a forwarded ref */}
      <div ref={coupleSectionRef as React.RefObject<HTMLDivElement>}>
        <Couple couple={data.couple} heading={data.heading} />
      </div>

      {/* Golden light bleed: Couple -> Procession */}
      <div className="kd-light-bleed kd-light-bleed--gold" />

      {/* Elephant Procession divider between Couple and Countdown */}
      <div ref={processionRef} className="kd-procession-divider">
        <ElephantProcession />
      </div>

      {/* Golden light bleed: Procession -> Countdown */}
      <div className="kd-light-bleed kd-light-bleed--gold" />

      <Countdown weddingDate={data.weddingDate} />

      {/* Backwater waves divider: Countdown -> Celebrations */}
      <div className="kd-water-ripple-divider">
        <BackwaterWaves />
      </div>

      <Celebrations events={data.celebrations} />

      {/* Warm light bleed: Celebrations -> RSVP */}
      <div className="kd-light-bleed kd-light-bleed--gold" />

      <RSVP />

      {/* Dawn warm light bleed: RSVP -> Closing */}
      <div className="kd-light-bleed kd-light-bleed--warm" />

      <Closing
        couple={data.couple}
        weddingDate={data.weddingDate}
        blessing={data.blessing}
      />
    </div>
  )
}
