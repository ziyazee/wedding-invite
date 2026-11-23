/* Couple — the two families, each under a cusped jharokha arch, tied by a palla knot.
   The shamiana valance frames the top and the Ik Onkar sits in its open centre.
   Animation: heading words focus-pull in, arches open with a centre-out curtain wipe,
   the arch outlines and the knot draw themselves. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, drawOn, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CoupleDivider from './Divider'
import valance from '../../assets/generated/shamiana-valance.png'
import crest from '../../assets/generated/family-crest.webp'
import corner from '../../assets/generated/family-corner.webp'
import './couple.css'

/** One family. The card grows with its content: a CSS panel, four stretch-free corner pieces
    (sarson + wheat from the family land) and the ancestral-home crest perched on the top edge. */
function Family({ label, father, mother, name }: { label: string; father: string; mother: string; name: string }) {
  return (
    <div className="pb-family">
      <img className="pb-family__crest" src={crest} alt="" loading="lazy" decoding="async" />
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <img key={pos} className={`pb-family__corner pb-family__corner--${pos}`} src={corner} alt="" loading="lazy" decoding="async" />
      ))}
      <div className="pb-family__body">
        <p className="pb-family__label">{label}</p>
        <p className="pb-family__parent">{father}</p>
        <p className="pb-family__amp">&amp;</p>
        <p className="pb-family__parent">{mother}</p>
        <span className="pb-family__rule" aria-hidden="true" />
        <h2 className="pb-family__name">{name}</h2>
      </div>
    </div>
  )
}

function Couple({ data, ctx }: SectionProps) {
  const { couple } = data
  const ref = useRef<HTMLElement>(null)
  const heading =
    data.heading ?? 'With the blessings of Waheguru, together with their families, invite you to the Anand Karaj of'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.pb-couple__onkar', { trigger: '.pb-couple__onkar', duration: 1.4 })
      reveal('.pb-couple__heading .pb-word', { trigger: '.pb-couple__heading', stagger: 0.05, duration: 0.9 })
      reveal('.pb-couple .pb-eyebrow', { trigger: '.pb-couple .pb-eyebrow' })

      gsap.from('.pb-couple__valance', { opacity: 0, scale: 1.04, duration: 1.8, ease: EASE.out })

      gsap.utils.toArray<HTMLElement>('.pb-family').forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        gsap.from(card, { opacity: 0, scale: 0.97, duration: 1.2, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelector('.pb-family__crest'), {
          opacity: 0,
          scale: 0.82,
          transformOrigin: '50% 100%',
          duration: 1.4,
          ease: EASE.expo,
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.pb-family__corner'), {
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.4,
          stagger: 0.12,
          delay: 0.2,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.pb-family__label, .pb-family__parent, .pb-family__amp, .pb-family__rule, .pb-family__name'), {
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.9,
          stagger: 0.08,
          delay: 0.35,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: st,
        })
      })

      drawOn('.pb-couple__knot .pb-draw', { trigger: '.pb-couple__knot', stagger: 0.18, duration: 1.4 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="pb-section pb-couple" aria-label="Families">
      <img className="pb-couple__valance" src={valance} alt="" loading="lazy" decoding="async" />
      <div className="pb-section__inner">
        <p className="pb-couple__onkar" lang="pa" aria-label="Ik Onkar">ੴ</p>
        <p className="pb-eyebrow">The families</p>
        <p className="pb-couple__heading">
          <Words text={heading} />
        </p>

        <Family
          label={couple.groomParentLabel ?? 'Son of'}
          father={couple.groomFather}
          mother={couple.groomMother}
          name={couple.groomFullName}
        />

        {/* palla knot: the groom's scarf tied to the bride's dupatta */}
        <svg className="pb-couple__knot" viewBox="0 0 240 44" aria-hidden="true">
          <path className="pb-draw" pathLength="1" d="M0 22 H78 C90 22 94 10 104 10 C114 10 116 22 120 22" />
          <path className="pb-draw" pathLength="1" d="M240 22 H162 C150 22 146 34 136 34 C126 34 124 22 120 22" />
          <path className="pb-draw" pathLength="1" d="M78 22 C90 22 94 34 104 34 C114 34 116 22 120 22 C124 22 126 10 136 10 C146 10 150 22 162 22" />
          <path className="pb-draw" pathLength="1" d="M114 22 L120 17 L126 22 L120 27 Z" />
        </svg>

        <Family
          label={couple.brideParentLabel ?? 'Daughter of'}
          father={couple.brideFather}
          mother={couple.brideMother}
          name={couple.brideFullName}
        />
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'couple',
  Component: Couple,
  particles: [
    { sprite: 'gulab', motion: 'fall', count: 5, size: [12, 18], opacity: [0.4, 0.75], zone: 'margins', color: 'dawn' },
    { sprite: 'sparkle', motion: 'twinkle', count: 3, size: [10, 16], opacity: [0.3, 0.7], zone: 'margins', color: 'goldBright' },
  ],
  Divider: CoupleDivider,
}

export default plugin
