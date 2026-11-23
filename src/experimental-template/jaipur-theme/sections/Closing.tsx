import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { CoupleInfo } from '../types'

interface ClosingProps {
  couple: CoupleInfo
  weddingDate: string
  blessing?: string
}

export default function Closing({ couple, weddingDate, blessing }: ClosingProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const blessingRef = useRef<HTMLParagraphElement>(null)
  const namesRef = useRef<HTMLParagraphElement>(null)
  const dateRef = useRef<HTMLParagraphElement>(null)

  const dateObj = new Date(weddingDate)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return

      const els = [blessingRef.current, namesRef.current, dateRef.current].filter(Boolean)
      gsap.set(els, { opacity: 0 })
      if (namesRef.current) gsap.set(namesRef.current, { scale: 0.96 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
        defaults: { ease: 'power2.out' },
      })

      if (blessingRef.current) {
        tl.to(blessingRef.current, { opacity: 0.85, duration: 1.2 }, 0)
      }

      if (namesRef.current) {
        tl.to(namesRef.current, { opacity: 1, scale: 1, duration: 1.0 }, 0.8)
      }

      if (dateRef.current) {
        tl.to(dateRef.current, { opacity: 0.8, duration: 0.8 }, 1.6)
      }
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="jt-closing" aria-label="Closing">
      {blessing && <p ref={blessingRef} className="jt-closing__blessing">{blessing}</p>}
      <p ref={namesRef} className="jt-closing__names">
        {couple.groomName} &amp; {couple.brideName}
      </p>
      <p ref={dateRef} className="jt-closing__date">{formattedDate}</p>
    </section>
  )
}
