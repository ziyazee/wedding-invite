/* Couple — families and names. Animation: heading words focus-pull in, cards open
   with a centre-out curtain wipe, the join rule grows from the middle. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import { ArchCap, BaseLotus, Medallion, NameFlourish, Sprig } from '../../core/Arch'
import CoupleDivider from './Divider'
import './couple.css'

function Couple({ data, ctx }: SectionProps) {
  const { couple } = data
  const ref = useRef<HTMLElement>(null)
  const heading = data.heading ?? 'Together with their families, invite you to celebrate the union of'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      reveal('.gw-couple__heading .gw-word', { trigger: '.gw-couple__heading', stagger: 0.05, duration: 0.9 })
      reveal('.gw-couple .gw-eyebrow', { trigger: '.gw-couple .gw-eyebrow' })

      const cards = gsap.utils.toArray<HTMLElement>('.gw-family')
      cards.forEach((card) => {
        gsap.from(card, {
          clipPath: 'inset(0 50% 0 50%)',
          opacity: 0,
          duration: 1.3,
          ease: EASE.expo,
          scrollTrigger: { trigger: card, start: 'top 82%', once: true },
        })
        gsap.from(card.querySelectorAll('.gw-family__deva, .gw-family__label, .gw-family__parent, .gw-family__amp, .gw-family__name, .gw-arch__flourish, .gw-arch__medallion'), {
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

      gsap.from('.gw-couple__join i', {
        scaleX: 0,
        duration: 1.2,
        ease: EASE.inOut,
        scrollTrigger: { trigger: '.gw-couple__join', start: 'top 88%', once: true },
      })
      reveal('.gw-couple__join span', { trigger: '.gw-couple__join', duration: 0.9 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="gw-section gw-couple" aria-label="Families">
      <div className="gw-section__inner">
        <p className="gw-eyebrow">The families</p>
        <p className="gw-couple__heading">
          <Words text={heading} />
        </p>

        <div className="gw-family gw-family--groom">
          <ArchCap />
          <Medallion initial={couple.groomName.charAt(0)} />
          <p className="gw-family__deva" lang="hi">{'सुपुत्र'}</p>
          <p className="gw-family__label">{couple.groomParentLabel ?? 'Son of'}</p>
          <p className="gw-family__parent">{couple.groomFather}</p>
          <p className="gw-family__amp" aria-hidden="true"><i /><b /><i /></p>
          <p className="gw-family__parent">{couple.groomMother}</p>
          <h2 className="gw-family__name">{couple.groomFullName}</h2>
          <NameFlourish />
          <Sprig side="l" />
          <Sprig side="r" />
          <BaseLotus />
        </div>

        <div className="gw-couple__join" aria-hidden="true">
          <i />
          <span>&amp;</span>
          <i />
        </div>

        <div className="gw-family gw-family--bride">
          <ArchCap />
          <Medallion initial={couple.brideName.charAt(0)} />
          <p className="gw-family__deva" lang="hi">{'सुपुत्री'}</p>
          <p className="gw-family__label">{couple.brideParentLabel ?? 'Daughter of'}</p>
          <p className="gw-family__parent">{couple.brideFather}</p>
          <p className="gw-family__amp" aria-hidden="true"><i /><b /><i /></p>
          <p className="gw-family__parent">{couple.brideMother}</p>
          <h2 className="gw-family__name">{couple.brideFullName}</h2>
          <NameFlourish />
          <Sprig side="l" />
          <Sprig side="r" />
          <BaseLotus />
        </div>
      </div>
    </section>
  )
}

const plugin: SectionPlugin = {
  id: 'couple',
  Component: Couple,
  particles: [
    { sprite: 'marigold', motion: 'fall', count: 5, size: [16, 26], opacity: [0.4, 0.75], zone: 'margins', color: 'dawn' },
    { sprite: 'rosepetal', motion: 'fall', count: 5, size: [10, 18], opacity: [0.3, 0.6], zone: 'margins', color: 'rose' },
    { sprite: 'jasmine', motion: 'drift', count: 4, size: [14, 20], opacity: [0.6, 0.95], zone: 'margins', color: 'goldDim' },
  ],
  Divider: CoupleDivider,
}

export default plugin
