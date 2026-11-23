/* Couple — two nikahnama-style family folios under a carved-lintel and rose-garland valance.
   Each card is a flexible CSS panel crowned by a mihrab crest and held by four mirrored rose corners.
   A khatam thread joins the two families. Animation: the valance unfolds from the centre, heading words
   focus-pull in, cards settle, crests unroll, corners bloom, the thread draws itself. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CoupleDivider from './Divider'
import { khatam } from '../khatam'
import valanceSrc from '../../assets/generated/couple-valance.webp'
import crestSrc from '../../assets/generated/family-crest.webp'
import cornerSrc from '../../assets/generated/family-corner.webp'
import './couple.css'

const RULE = khatam(12, 12, 8)
const KNOT = khatam(30, 60, 17)
const STAR = khatam(12, 12, 9.5)

function FamilyArt() {
  return (
    <>
      <img className="mw-family__corner mw-family__corner--tl" src={cornerSrc} alt="" loading="lazy" decoding="async" />
      <img className="mw-family__corner mw-family__corner--tr" src={cornerSrc} alt="" loading="lazy" decoding="async" />
      <img className="mw-family__corner mw-family__corner--bl" src={cornerSrc} alt="" loading="lazy" decoding="async" />
      <img className="mw-family__corner mw-family__corner--br" src={cornerSrc} alt="" loading="lazy" decoding="async" />
      <div className="mw-family__crest">
        <img src={crestSrc} alt="" loading="lazy" decoding="async" />
        <svg className="mw-family__crest-star" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="11.5" />
          <path d={STAR.star} />
        </svg>
      </div>
    </>
  )
}

function FamilyRule() {
  return (
    <div className="mw-family__rule" aria-hidden="true">
      <i />
      <svg viewBox="0 0 24 24"><path d={RULE.upright} /><path d={RULE.turned} /></svg>
      <i />
    </div>
  )
}

/** The thread between the families: pearls, a khatam knot holding the ampersand. */
function Thread() {
  return (
    <svg className="mw-couple__thread" viewBox="0 0 60 150" aria-hidden="true">
      <path className="mw-draw" pathLength="1" d="M30 0 V40" />
      <path className="mw-draw" pathLength="1" d={KNOT.star} />
      <path className="mw-draw" pathLength="1" d={KNOT.upright} style={{ opacity: 0.5 }} />
      <path className="mw-draw" pathLength="1" d="M30 80 V150" />
      <circle className="mw-fill-gold" cx="30" cy="14" r="2" />
      <circle className="mw-fill-gold" cx="30" cy="26" r="1.4" />
      <circle className="mw-fill-gold" cx="30" cy="100" r="1.4" />
      <circle className="mw-fill-gold" cx="30" cy="112" r="2" />
      <circle className="mw-fill-gold" cx="30" cy="124" r="1.4" />
      <text x="30" y="65" textAnchor="middle" className="mw-couple__thread-amp">&amp;</text>
    </svg>
  )
}

function Couple({ data, ctx }: SectionProps) {
  const { couple } = data
  const ref = useRef<HTMLElement>(null)
  const heading = data.heading ?? 'Together with their families, invite you to celebrate the union of'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.mw-couple__valance', {
        clipPath: 'inset(0 50% 0 50%)',
        opacity: 0,
        duration: 1.8,
        ease: EASE.expo,
        clearProps: 'clipPath',
        scrollTrigger: { trigger: '.mw-couple', start: 'top 85%', once: true },
      })
      reveal('.mw-couple__heading .mw-word', { trigger: '.mw-couple__heading', stagger: 0.05, duration: 0.9 })
      reveal('.mw-couple .mw-eyebrow', { trigger: '.mw-couple .mw-eyebrow' })

      const cards = gsap.utils.toArray<HTMLElement>('.mw-family')
      cards.forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        gsap.from(card, { opacity: 0, scale: 0.97, duration: 1.2, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.mw-family__crest'), {
          clipPath: 'inset(0 50% 0 50%)',
          opacity: 0,
          duration: 1.4,
          delay: 0.2,
          ease: EASE.expo,
          clearProps: 'clipPath',
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.mw-family__corner'), {
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.2,
          delay: 0.5,
          stagger: 0.12,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.mw-family__label, .mw-family__parent, .mw-family__amp, .mw-family__name'), {
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.9,
          stagger: 0.08,
          delay: 0.45,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.mw-family__rule i'), {
          scaleX: 0,
          duration: 1.1,
          delay: 0.9,
          ease: EASE.inOut,
          scrollTrigger: st,
        })
      })

      gsap.from('.mw-couple__thread .mw-draw', {
        strokeDashoffset: 1,
        duration: 1.6,
        stagger: 0.25,
        ease: 'power2.inOut',
        scrollTrigger: { trigger: '.mw-couple__thread', start: 'top 88%', once: true },
      })
      gsap.from('.mw-couple__thread .mw-fill-gold, .mw-couple__thread-amp', {
        opacity: 0,
        duration: 1,
        delay: 0.6,
        stagger: 0.08,
        ease: EASE.out,
        scrollTrigger: { trigger: '.mw-couple__thread', start: 'top 88%', once: true },
      })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="mw-section mw-couple" aria-label="Families">
      <img className="mw-couple__valance" src={valanceSrc} alt="" decoding="async" />
      <div className="mw-section__inner">
        <p className="mw-eyebrow">The families</p>
        <p className="mw-couple__heading">
          <Words text={heading} />
        </p>

        <div className="mw-family">
          <FamilyArt />
          <p className="mw-family__label">{couple.groomParentLabel ?? 'Son of'}</p>
          <p className="mw-family__parent">{couple.groomFather}</p>
          <p className="mw-family__amp">&amp;</p>
          <p className="mw-family__parent">{couple.groomMother}</p>
          <FamilyRule />
          <h2 className="mw-family__name">{couple.groomFullName}</h2>
        </div>

        <Thread />

        <div className="mw-family">
          <FamilyArt />
          <p className="mw-family__label">{couple.brideParentLabel ?? 'Daughter of'}</p>
          <p className="mw-family__parent">{couple.brideFather}</p>
          <p className="mw-family__amp">&amp;</p>
          <p className="mw-family__parent">{couple.brideMother}</p>
          <FamilyRule />
          <h2 className="mw-family__name">{couple.brideFullName}</h2>
        </div>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'couple',
  Component: Couple,
  particles: [
    { sprite: 'mogra', motion: 'fall', count: 5, size: [9, 14], opacity: [0.5, 0.85], zone: 'margins', color: 'goldBright' },
    { sprite: 'rosepetal', motion: 'fall', count: 4, size: [12, 18], opacity: [0.45, 0.8], zone: 'margins', color: 'blush' },
    { sprite: 'zari', motion: 'twinkle', count: 3, size: [5, 8], opacity: [0.35, 0.7], zone: 'margins', color: 'goldBright' },
  ],
  Divider: CoupleDivider,
}

export default plugin
