/* Couple — "The Families": two families under a zardozi velvet valance. Animation: the valance drops in,
   each card opens outward from its centre line like an iwan, the marble arch crest rises, and the
   khatam star between the families draws on with Masha'Allah settling beneath it. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CoupleDivider from './Divider'
import valanceSrc from '../../assets/generated/couple-zardozi-valance.webp'
import crestSrc from '../../assets/generated/family-arch-crest.webp'
import cornerSrc from '../../assets/generated/family-pietra-corner.webp'
import './couple.css'

interface FamilyProps {
  label: string
  father: string
  mother: string
  name: string
  place?: string
  side: 'groom' | 'bride'
}

function Family({ label, father, mother, name, place, side }: FamilyProps) {
  return (
    <div className={`mr-family mr-family--${side}`}>
      <img className="mr-family__crest" src={crestSrc} alt="" width={720} height={458} decoding="async" />
      <img className="mr-family__corner mr-family__corner--l" src={cornerSrc} alt="" width={400} height={414} decoding="async" />
      <img className="mr-family__corner mr-family__corner--r" src={cornerSrc} alt="" width={400} height={414} decoding="async" />
      <p className="mr-family__label">{label}</p>
      <p className="mr-family__parent">{father}</p>
      <p className="mr-family__amp">&amp;</p>
      <p className="mr-family__parent">{mother}</p>
      <h2 className="mr-family__name">{name}</h2>
      {place ? <p className="mr-family__place">{place}</p> : null}
    </div>
  )
}

function Couple({ data, ctx }: SectionProps) {
  const { couple } = data
  const ref = useRef<HTMLElement>(null)
  const heading = data.heading ?? 'With the blessings of Allah, and the love of our families, we invite you to the wedding of our beloved'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.mr-couple__valance', { yPercent: -30, opacity: 0, duration: 1.4, ease: EASE.expo })
      gsap.from('.mr-couple__sway', { rotate: 0.6, transformOrigin: '50% 0%', duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      reveal('.mr-couple__jodi', { trigger: '.mr-couple__jodi' })
      reveal('.mr-couple__heading .mr-word', { trigger: '.mr-couple__heading', stagger: 0.04, duration: 0.8 })

      gsap.utils.toArray<HTMLElement>('.mr-family').forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        // The crest overhangs the card's top edge, so the clip must be open vertically (negative top/bottom).
        gsap.fromTo(card, { clipPath: 'inset(-140px 50% -40px 50%)', opacity: 0 }, { clipPath: 'inset(-140px 0% -40px 0%)', opacity: 1, duration: 1.3, ease: EASE.expo, scrollTrigger: st, clearProps: 'clipPath' })
        gsap.from(card.querySelector('.mr-family__crest'), { y: 46, scale: 0.9, opacity: 0, filter: 'blur(6px)', duration: 1.4, delay: 0.3, ease: EASE.out, clearProps: 'filter', scrollTrigger: st })
        gsap.from(card.querySelectorAll('.mr-family__corner'), { scale: 0.6, opacity: 0, duration: 0.9, delay: 0.5, stagger: 0.12, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelectorAll('.mr-family__label, .mr-family__parent, .mr-family__amp, .mr-family__name, .mr-family__place'), {
          opacity: 0, y: 10, duration: 0.8, stagger: 0.07, delay: 0.45, ease: EASE.out, scrollTrigger: st,
        })
      })

      gsap.from('.mr-couple__paranda .mr-draw', {
        strokeDashoffset: 1, duration: 1.4, stagger: 0.08, ease: EASE.inOut,
        scrollTrigger: { trigger: '.mr-couple__paranda', start: 'top 88%', once: true },
      })
      reveal('.mr-couple__paranda-mark', { trigger: '.mr-couple__paranda', duration: 1.1 })
      gsap.from('.mr-couple__paranda-star', { rotate: -45, scale: 0.4, opacity: 0, transformOrigin: '50% 50%', duration: 1.2, ease: EASE.out, scrollTrigger: { trigger: '.mr-couple__paranda', start: 'top 88%', once: true } })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="mr-section mr-couple" aria-label="Families">
      <img className="mr-couple__valance mr-couple__sway" src={valanceSrc} alt="" width={1200} height={432} decoding="async" />
      <div className="mr-section__inner">
        <p className="mr-couple__eyebrow">With joy</p>
        <p className="mr-couple__jodi">The Families</p>
        <p className="mr-couple__heading">
          <Words text={heading} />
        </p>

        <Family
          side="groom"
          label={couple.groomParentLabel ?? 'Son of'}
          father={couple.groomFather}
          mother={couple.groomMother}
          name={couple.groomFullName}
          place={couple.groomPlace}
        />

        <div className="mr-couple__paranda" aria-hidden="true">
          <svg viewBox="0 0 260 56" width="260" height="56">
            <path className="mr-draw" pathLength="1" d="M0 28 H92" />
            <path className="mr-draw" pathLength="1" d="M168 28 H260" />
            <path className="mr-draw" pathLength="1" d="M92 28 L100 22 L108 28 L100 34 Z" />
            <path className="mr-draw" pathLength="1" d="M152 28 L160 22 L168 28 L160 34 Z" />
            <g className="mr-couple__paranda-star">
              <path className="mr-draw" pathLength="1" d="M130 4 L151 28 L130 52 L109 28 Z" />
              <path className="mr-draw" pathLength="1" d="M113.2 11.2 H146.8 V44.8 H113.2 Z" />
              <path className="mr-draw" pathLength="1" d="M130 17 L141 28 L130 39 L119 28 Z" />
            </g>
          </svg>
          <span className="mr-couple__paranda-mark mr-arabic" lang="ar" dir="rtl">ما شاء الله</span>
        </div>

        <Family
          side="bride"
          label={couple.brideParentLabel ?? 'Daughter of'}
          father={couple.brideFather}
          mother={couple.brideMother}
          name={couple.brideFullName}
          place={couple.bridePlace}
        />
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'couple',
  Component: Couple,
  particles: [
    { sprite: 'rose', motion: 'fall', count: 7, size: [12, 20], opacity: [0.3, 0.6], zone: 'margins', color: 'rose' },
    { sprite: 'star8', motion: 'twinkle', count: 5, size: [10, 16], opacity: [0.2, 0.5], zone: 'margins', color: 'goldBright' },
  ],
  Divider: CoupleDivider,
}

export default plugin
