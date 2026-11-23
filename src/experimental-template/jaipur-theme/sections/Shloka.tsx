import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { LotusMotif } from '../assets'

interface ShlokaProps {
  shloka: string
  translation?: string
}

export default function Shloka({ shloka, translation }: ShlokaProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return

      const els = sectionRef.current.querySelectorAll(
        '.jt-shloka__lotus, .jt-shloka__sanskrit, .jt-shloka__translation'
      )

      gsap.set(els, { opacity: 0 })

      gsap.to(els, {
        opacity: 1,
        duration: 1,
        stagger: 0.3,
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
    <section ref={sectionRef} className="jt-shloka" aria-label="Sanskrit blessing">
      <div className="jt-shloka__lotus">
        <LotusMotif size={64} />
      </div>
      <p className="jt-shloka__sanskrit">{shloka}</p>
      {translation && (
        <p className="jt-shloka__translation">{translation}</p>
      )}
    </section>
  )
}
