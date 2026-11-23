import { useRef } from 'react'
import type { CoupleInfo } from '../types'
import { DomeSilhouette, CrescentMoon, OrnamentalDivider } from '../assets'

interface Props {
  couple: CoupleInfo
}

export default function Closing({ couple }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="tj-closing">
      {/* Dome silhouette watermark behind content */}
      <DomeSilhouette className="tj-closing__dome" size={200} />

      <div className="tj-closing__content">
        {/* Section heading */}
        <div className="tj-section-heading">
          <h2 className="tj-section-heading__text">With Love and Gratitude</h2>
          <OrnamentalDivider motif="diamond" width="30%" />
        </div>

        {/* Gratitude text */}
        <p className="tj-closing-gratitude">
          We thank you for being part of our journey. Your presence and blessings
          mean the world to us and our families.
        </p>

        {/* Couple names */}
        <p className="tj-closing-names">
          {couple.brideName} &amp; {couple.groomName}
        </p>

        {/* Short gold rule */}
        <div className="tj-closing-rule" />

        {/* Family names */}
        <p className="tj-closing-families">
          The {couple.groomFullName.split(' ').pop()} &amp;{' '}
          {couple.brideFullName.split(' ').pop()} Families
        </p>

        {/* Crescent + 3 stars — echoing the opening */}
        <div className="tj-closing-crescent">
          <CrescentMoon size={24} stars={3} />
        </div>
      </div>
    </section>
  )
}
