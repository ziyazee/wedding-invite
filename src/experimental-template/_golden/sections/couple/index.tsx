/* Couple — families and names. Animation: heading words focus-pull in, cards open
   with a centre-out curtain wipe, the join rule grows from the middle. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CoupleDivider from './Divider'
import './couple.css'

function Couple({ data, ctx }: SectionProps) {
  const { couple } = data
  const ref = useRef<HTMLElement>(null)
  const heading = data.heading ?? 'Together with their families, invite you to celebrate the union of'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.gd-couple__heading .gd-word', { trigger: '.gd-couple__heading', stagger: 0.05, duration: 0.9 })
      reveal('.gd-couple .gd-eyebrow', { trigger: '.gd-couple .gd-eyebrow' })

      const cards = gsap.utils.toArray<HTMLElement>('.gd-family')
      cards.forEach((card) => {
        gsap.from(card, {
          clipPath: 'inset(0 50% 0 50%)',
          opacity: 0,
          duration: 1.3,
          ease: EASE.expo,
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        })
        gsap.from(card.querySelectorAll('.gd-family__label, .gd-family__parent, .gd-family__amp, .gd-family__name'), {
          opacity: 0,
          filter: 'blur(6px)',
          duration: 0.9,
          stagger: 0.08,
          delay: 0.35,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        })
      })

      gsap.from('.gd-couple__join i', {
        scaleX: 0,
        duration: 1.2,
        ease: EASE.inOut,
        scrollTrigger: { trigger: '.gd-couple__join', start: 'top 88%', once: true },
      })
      reveal('.gd-couple__join span', { trigger: '.gd-couple__join', duration: 0.9 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="gd-section gd-couple" aria-label="Families">
      <div className="gd-section__inner">
        <p className="gd-eyebrow">The families</p>
        <p className="gd-couple__heading">
          <Words text={heading} />
        </p>

        <div className="gd-family">
          <p className="gd-family__label">{couple.groomParentLabel ?? 'Son of'}</p>
          <p className="gd-family__parent">{couple.groomFather}</p>
          <p className="gd-family__amp">&amp;</p>
          <p className="gd-family__parent">{couple.groomMother}</p>
          <h2 className="gd-family__name">{couple.groomFullName}</h2>
        </div>

        <div className="gd-couple__join" aria-hidden="true">
          <i />
          <span>&amp;</span>
          <i />
        </div>

        <div className="gd-family">
          <p className="gd-family__label">{couple.brideParentLabel ?? 'Daughter of'}</p>
          <p className="gd-family__parent">{couple.brideFather}</p>
          <p className="gd-family__amp">&amp;</p>
          <p className="gd-family__parent">{couple.brideMother}</p>
          <h2 className="gd-family__name">{couple.brideFullName}</h2>
        </div>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'couple',
  Component: Couple,
  particles: [
    { sprite: 'petal', motion: 'fall', count: 6, size: [12, 20], opacity: [0.3, 0.6], zone: 'margins', color: 'dawn' },
    { sprite: 'sparkle', motion: 'twinkle', count: 3, size: [10, 16], opacity: [0.2, 0.55], zone: 'margins', color: 'goldBright' },
  ],
  Divider: CoupleDivider,
}

export default plugin
