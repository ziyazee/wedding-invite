import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { sampleWedding } from './data/sample'
import GoldParticles from './components/GoldParticles'
import { SectionDividerSvg } from './assets/svg'
import Opening from './sections/Opening'
import Invitation from './sections/Invitation'
import Ceremony from './sections/Ceremony'
import Countdown from './sections/Countdown'
import QuranicVerse from './sections/QuranicVerse'
import Venue from './sections/Venue'
import Contacts from './sections/Contacts'
import Closing from './sections/Closing'
import './styles/main.css'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function NikahNoor() {
  const data = sampleWedding
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // ── Hero parallax layers ──
    gsap.to('.nn-hero-pattern', {
      y: 120,
      scrollTrigger: { trigger: '.nn-hero', start: 'top top', end: 'bottom top', scrub: true },
    })

    gsap.to('.nn-hero-lantern--left', {
      y: 50,
      scrollTrigger: { trigger: '.nn-hero', start: 'top top', end: 'bottom top', scrub: true },
    })

    gsap.to('.nn-hero-lantern--right', {
      y: 35,
      scrollTrigger: { trigger: '.nn-hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    })

    // ── Section dividers: scale in from center ──
    gsap.utils.toArray<HTMLElement>('.nn-section-divider').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, scaleX: 0 },
        {
          opacity: 1, scaleX: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        }
      )
    })

    // ── Invitation: rise with slight scale ──
    gsap.fromTo('.nn-section-invitation .nn-section-inner',
      { opacity: 0, y: 60, scale: 0.97 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: '.nn-section-invitation', start: 'top 82%' },
      }
    )

    // ── Ceremony: sequenced perspective entrance ──
    const ceremonyTl = gsap.timeline({
      scrollTrigger: { trigger: '.nn-section-ceremony', start: 'top 78%' },
    })
    ceremonyTl
      .fromTo('.nn-section-ceremony .nn-gold-text',
        { opacity: 0, scale: 0.6, rotateY: -15 },
        { opacity: 1, scale: 1, rotateY: 0, duration: 0.7, ease: 'back.out(1.7)' })
      .fromTo('.nn-ceremony-title',
        { opacity: 0, letterSpacing: '0.2em', y: 24 },
        { opacity: 1, letterSpacing: '0.04em', y: 0, duration: 0.9 }, '-=0.3')
      .fromTo('.nn-ceremony-card',
        { opacity: 0, y: 44, rotateX: 6 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
      .fromTo('.nn-ceremony-row',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.12 }, '-=0.5')

    // ── Countdown: elastic bounce-in ──
    const countdownTl = gsap.timeline({
      scrollTrigger: { trigger: '.nn-section-countdown', start: 'top 78%' },
    })
    countdownTl
      .fromTo('.nn-countdown-arabic',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('.nn-countdown-sub',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5 }, '-=0.2')
      .fromTo('.nn-countdown-unit',
        { opacity: 0, scale: 0.5, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'elastic.out(1, 0.5)' }, '-=0.2')

    // ── Verse: dramatic layered reveal ──
    const verseTl = gsap.timeline({
      scrollTrigger: { trigger: '.nn-section-verse', start: 'top 78%' },
    })
    verseTl
      .fromTo('.nn-verse-ref',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('.nn-verse-arabic',
        { opacity: 0, y: 30, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'power2.out' }, '-=0.2')
      .fromTo('.nn-section-verse .nn-ornament',
        { opacity: 0, scaleX: 0 },
        { opacity: 1, scaleX: 1, duration: 0.7, ease: 'power2.out' }, '-=0.6')
      .fromTo('.nn-verse-translation',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '-=0.4')

    // ── Venue: card lifts with 3D tilt ──
    gsap.fromTo('.nn-venue-card',
      { opacity: 0, y: 50, rotateX: 5 },
      {
        opacity: 1, y: 0, rotateX: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.nn-section-venue', start: 'top 80%' },
      }
    )

    // ── Contacts: alternating slide with perspective ──
    gsap.utils.toArray<HTMLElement>('.nn-contact').forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, x: i % 2 === 0 ? -40 : 40, rotateY: i % 2 === 0 ? -6 : 6 },
        {
          opacity: 1, x: 0, rotateY: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 86%' },
        }
      )
    })

    // ── Closing: gentle scale reveal ──
    gsap.fromTo('.nn-section-closing .nn-section-inner',
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1, duration: 1.3, ease: 'power2.out',
        scrollTrigger: { trigger: '.nn-section-closing', start: 'top 80%' },
      }
    )

    // ── Ornament parallax ──
    gsap.utils.toArray<HTMLElement>('.nn-ornament').forEach((el) => {
      gsap.to(el, {
        y: -20,
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      })
    })

  }, { scope: pageRef })

  return (
    <div className="nn-page" ref={pageRef}>
      <GoldParticles />

      <Opening
        couple={data.couple}
        weddingDate={data.weddingDate}
        hashtag={data.hashtag}
      />

      <div className="nn-section-divider"><SectionDividerSvg width={200} /></div>

      <Invitation
        couple={data.couple}
        blessing={data.blessing}
      />

      <div className="nn-section-divider"><SectionDividerSvg width={200} /></div>

      <Ceremony celebrations={data.celebrations} />

      <div className="nn-section-divider"><SectionDividerSvg width={200} /></div>

      <Countdown weddingDate={data.weddingDate} />

      {data.quranicVerse && (
        <QuranicVerse
          arabic={data.quranicVerse.arabic}
          translation={data.quranicVerse.translation}
          reference={data.quranicVerse.reference}
        />
      )}

      <div className="nn-section-divider"><SectionDividerSvg width={200} /></div>

      <Venue venue={data.venue} />

      <div className="nn-section-divider"><SectionDividerSvg width={200} /></div>

      <Contacts contacts={data.contacts} />

      <div className="nn-section-divider"><SectionDividerSvg width={200} /></div>

      <Closing
        couple={data.couple}
        closingBlessing={data.closingBlessing}
      />
    </div>
  )
}
