import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface Props {
  count?: number
}

export default function GoldParticles({ count = 28 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = ref.current?.querySelectorAll('.nn-particle')
    if (!els) return

    els.forEach((el) => {
      const size = 2 + Math.random() * 4
      const startX = Math.random() * 100
      const startY = Math.random() * 100
      const drift = (Math.random() - 0.5) * 60
      const rise = 40 + Math.random() * 100
      const dur = 7 + Math.random() * 10
      const peakOpacity = 0.12 + Math.random() * 0.22

      gsap.set(el, {
        left: `${startX}%`,
        top: `${startY}%`,
        width: size,
        height: size,
      })

      gsap.to(el, {
        y: -rise,
        x: drift,
        opacity: peakOpacity,
        duration: dur,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * dur,
      })
    })
  }, { scope: ref })

  return (
    <div ref={ref} className="nn-particles" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="nn-particle" />
      ))}
    </div>
  )
}
