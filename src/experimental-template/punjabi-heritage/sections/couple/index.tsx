/* Couple — "Jodi": two families under a phulkari valance. Animation: the valance drops in,
   each deorhi crest rises and the card opens upward from its threshold, the stitched
   paranda between the families draws on from the centre. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CoupleDivider from './Divider'
import valanceSrc from '../../assets/generated/couple-phulkari-valance.webp'
import crestSrc from '../../assets/generated/family-deorhi-crest.webp'
import cornerSrc from '../../assets/generated/family-sarhon-corner.webp'
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
    <div className={`ph-family ph-family--${side}`}>
      <img className="ph-family__crest" src={crestSrc} alt="" width={720} height={233} loading="lazy" decoding="async" />
      <img className="ph-family__corner ph-family__corner--l" src={cornerSrc} alt="" width={400} height={395} loading="lazy" decoding="async" />
      <img className="ph-family__corner ph-family__corner--r" src={cornerSrc} alt="" width={400} height={395} loading="lazy" decoding="async" />
      <p className="ph-family__label">{label}</p>
      <p className="ph-family__parent">{father}</p>
      <p className="ph-family__amp">&amp;</p>
      <p className="ph-family__parent">{mother}</p>
      <h2 className="ph-family__name">{name}</h2>
      {place ? <p className="ph-family__place">{place}</p> : null}
    </div>
  )
}

function Couple({ data, ctx }: SectionProps) {
  const { couple } = data
  const ref = useRef<HTMLElement>(null)
  const heading = data.heading ?? 'With the blessings of our elders, we invite you to the wedding of our beloved'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.ph-couple__valance', { yPercent: -30, opacity: 0, duration: 1.4, ease: EASE.expo })
      reveal('.ph-couple__jodi', { trigger: '.ph-couple__jodi' })
      reveal('.ph-couple__heading .ph-word', { trigger: '.ph-couple__heading', stagger: 0.04, duration: 0.8 })

      gsap.utils.toArray<HTMLElement>('.ph-family').forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        gsap.from(card, { clipPath: 'inset(100% 0 0 0)', opacity: 0, duration: 1.2, ease: EASE.expo, scrollTrigger: st })
        gsap.from(card.querySelector('.ph-family__crest'), { y: 30, opacity: 0, duration: 1, delay: 0.25, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelectorAll('.ph-family__corner'), { scale: 0.6, opacity: 0, duration: 0.9, delay: 0.5, stagger: 0.12, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelectorAll('.ph-family__label, .ph-family__parent, .ph-family__amp, .ph-family__name, .ph-family__place'), {
          opacity: 0, y: 10, duration: 0.8, stagger: 0.07, delay: 0.45, ease: EASE.out, scrollTrigger: st,
        })
      })

      gsap.from('.ph-couple__paranda .ph-draw', {
        strokeDashoffset: 1, duration: 1.4, stagger: 0.08, ease: EASE.inOut,
        scrollTrigger: { trigger: '.ph-couple__paranda', start: 'top 88%', once: true },
      })
      reveal('.ph-couple__paranda-mark', { trigger: '.ph-couple__paranda', duration: 0.9 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="ph-section ph-couple" aria-label="Families">
      <img className="ph-couple__valance" src={valanceSrc} alt="" width={1200} height={413} decoding="async" />
      <div className="ph-section__inner">
        <p className="ph-couple__jodi">Jodi</p>
        <p className="ph-couple__heading">
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

        <div className="ph-couple__paranda" aria-hidden="true">
          <svg viewBox="0 0 240 40" width="240" height="40">
            <path className="ph-draw" pathLength="1" d="M0 20 H88" />
            <path className="ph-draw" pathLength="1" d="M152 20 H240" />
            <path className="ph-draw" pathLength="1" d="M88 20 L96 12 L104 20 L96 28 Z" />
            <path className="ph-draw" pathLength="1" d="M136 20 L144 12 L152 20 L144 28 Z" />
          </svg>
          <span className="ph-couple__paranda-mark">&amp;</span>
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
    { sprite: 'genda', motion: 'fall', count: 6, size: [12, 20], opacity: [0.3, 0.6], zone: 'margins', color: 'mustard' },
    { sprite: 'bagh', motion: 'twinkle', count: 4, size: [10, 16], opacity: [0.15, 0.4], zone: 'margins', color: 'suha' },
  ],
  Divider: CoupleDivider,
}

export default plugin
