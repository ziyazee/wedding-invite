/* Couple — the two families, each on a Kanchi-korvai card under a Chettinad lintel crest, tied by a
   turmeric thread. A mavilai-and-malli toran frames the top; the Pillaiyar Suzhi (உ) sits once, in its open centre.
   Animation: toran settles, the crest rises onto each card, corners fade in, the thread and the
   thaali pendant draw themselves. */

import { useRef } from 'react'
import { gsap, useGSAP, reveal, drawOn, Words, EASE } from '../../core'
import type { SectionPlugin, SectionProps } from '../../core'
import CoupleDivider from './Divider'
import valance from '../../assets/generated/thoran-valance.webp'
import crest from '../../assets/generated/family-crest.webp'
import corner from '../../assets/generated/family-corner.webp'
import './couple.css'

/** One family. The card grows with its content: a CSS panel, four mirrored corner pieces
    (annapakshi + malli) and the ancestral-home crest perched on the top edge. */
function Family({ label, father, mother, name }: { label: string; father: string; mother: string; name: string }) {
  return (
    <div className="tm-family">
      <img className="tm-family__crest" src={crest} alt="" loading="lazy" decoding="async" />
      {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
        <img key={pos} className={`tm-family__corner tm-family__corner--${pos}`} src={corner} alt="" loading="lazy" decoding="async" />
      ))}
      <div className="tm-family__body">
        <p className="tm-family__label">{label}</p>
        <p className="tm-family__parent">{father}</p>
        <p className="tm-family__amp">&amp;</p>
        <p className="tm-family__parent">{mother}</p>
        <span className="tm-family__rule" aria-hidden="true" />
        <h2 className="tm-family__name">{name}</h2>
      </div>
    </div>
  )
}

function Couple({ data, ctx }: SectionProps) {
  const { couple } = data
  const ref = useRef<HTMLElement>(null)
  const heading =
    data.heading ?? 'With the grace of God and the blessings of our elders, we invite you to the wedding of'

  useGSAP(
    () => {
      if (ctx.reducedMotion) return
      gsap.from('.tm-couple__valance', { opacity: 0, scale: 1.04, duration: 1.8, ease: EASE.out })
      reveal('.tm-couple__suzhi', { trigger: '.tm-couple__suzhi', duration: 1.4 })
      reveal('.tm-couple__heading .tm-word', { trigger: '.tm-couple__heading', stagger: 0.05, duration: 0.9 })
      reveal('.tm-couple .tm-eyebrow', { trigger: '.tm-couple .tm-eyebrow' })

      gsap.utils.toArray<HTMLElement>('.tm-family').forEach((card) => {
        const st = { trigger: card, start: 'top 82%', once: true }
        gsap.from(card, { opacity: 0, scale: 0.97, duration: 1.2, ease: EASE.out, scrollTrigger: st })
        gsap.from(card.querySelector('.tm-family__crest'), {
          opacity: 0,
          scale: 0.82,
          transformOrigin: '50% 100%',
          duration: 1.4,
          ease: EASE.expo,
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.tm-family__corner'), {
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.4,
          stagger: 0.12,
          delay: 0.2,
          ease: EASE.out,
          clearProps: 'filter',
          scrollTrigger: st,
        })
        gsap.from(card.querySelectorAll('.tm-family__label, .tm-family__parent, .tm-family__amp, .tm-family__rule, .tm-family__name'), {
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

      drawOn('.tm-couple__thread .tm-draw', { trigger: '.tm-couple__thread', stagger: 0.18, duration: 1.4 })
    },
    { scope: ref, dependencies: [ctx.reducedMotion] },
  )

  return (
    <section ref={ref} className="tm-section tm-couple" aria-label="Families">
      <img className="tm-couple__valance" src={valance} alt="" loading="lazy" decoding="async" />
      <div className="tm-section__inner">
        <p className="tm-couple__suzhi" lang="ta" aria-label="Pillaiyar Suzhi, the auspicious invocation">
          உ
        </p>
        <p className="tm-eyebrow tm-couple__tamil" lang="ta">
          இறையருளாலும் பெரியோர்களின் ஆசியுடனும்
        </p>
        <p className="tm-couple__heading">
          <Words text={heading} />
        </p>

        <Family
          label={couple.groomParentLabel ?? 'Son of'}
          father={couple.groomFather}
          mother={couple.groomMother}
          name={couple.groomFullName}
        />

        {/* manjal kayiru: a turmeric thread, twisted, with an abstract thaali pendant */}
        <svg className="tm-couple__thread" viewBox="0 0 60 64" aria-hidden="true">
          <path className="tm-draw tm-draw--manjal" pathLength="1" d="M30 0 C46 10 14 20 30 30 C46 40 14 50 30 60" />
          <path className="tm-draw tm-draw--manjal" pathLength="1" d="M30 0 C14 10 46 20 30 30 C14 40 46 50 30 60" />
          <path className="tm-draw" pathLength="1" d="M30 27 L35 32 L30 37 L25 32Z" />
          <circle className="tm-fill-gold" cx="30" cy="32" r="1.6" />
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
    { sprite: 'malli', motion: 'fall', count: 5, size: [10, 16], opacity: [0.5, 0.85], zone: 'margins', color: 'goldDim' },
    { sprite: 'kanakambaram', motion: 'fall', count: 3, size: [14, 20], opacity: [0.5, 0.85], zone: 'margins', color: 'dawn' },
  ],
  Divider: CoupleDivider,
}

export default plugin
