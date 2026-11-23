import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { CoupleInfo } from '../types'

interface CoupleProps {
  couple: CoupleInfo
  heading?: string
}

export default function Couple({ couple, heading }: CoupleProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return

      const els = sectionRef.current.querySelectorAll(
        '.jt-couple__heading, .jt-couple__name, .jt-couple__amp, .jt-couple__parent-block'
      )

      gsap.set(els, { opacity: 0 })

      gsap.to(els, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="jt-couple" aria-label="Couple details">
      {heading && <p className="jt-couple__heading">{heading}</p>}

      <div className="jt-couple__names">
        <h2 className="jt-couple__name">{couple.groomFullName}</h2>
        <span className="jt-couple__amp">&amp;</span>
        <h2 className="jt-couple__name">{couple.brideFullName}</h2>
      </div>

      <div className="jt-couple__parents">
        <div className="jt-couple__parent-block">
          <p className="jt-couple__parent-label">{couple.groomParentLabel || 'Son of'}</p>
          <p className="jt-couple__parent-names">
            {couple.groomFather} &amp; {couple.groomMother}
          </p>
        </div>
        <div className="jt-couple__parent-block">
          <p className="jt-couple__parent-label">{couple.brideParentLabel || 'Daughter of'}</p>
          <p className="jt-couple__parent-names">
            {couple.brideFather} &amp; {couple.brideMother}
          </p>
        </div>
      </div>
    </section>
  )
}
