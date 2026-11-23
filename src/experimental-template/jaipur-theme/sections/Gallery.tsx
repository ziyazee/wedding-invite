import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useGSAP(
    () => {
      if (prefersReducedMotion || !sectionRef.current) return

      const items = sectionRef.current.querySelectorAll('.jt-gallery__item')
      gsap.set(items, { opacity: 0, scale: 0.93 })

      ScrollTrigger.batch(items, {
        start: 'top 80%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power2.out',
            overwrite: true,
          })
        },
      })
    },
    { scope: sectionRef }
  )

  const placeholders = Array.from({ length: 4 }, (_, i) => i + 1)

  return (
    <section ref={sectionRef} className="jt-gallery" aria-label="Photo gallery">
      <h2 className="jt-gallery__title">Our Moments</h2>
      <div className="jt-gallery__grid">
        {placeholders.map((n) => (
          <div key={n} className="jt-gallery__item">
            <span className="jt-gallery__placeholder">Photo {n}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
