import { useRef } from 'react'
import type { CoupleInfo } from '../types'
import { MughalArch, RoseMotif, OrnamentalDivider } from '../assets'

interface Props {
  couple: CoupleInfo
  heading?: string
}

export default function Couple({ couple, heading }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="tj-couple">
      {/* Section heading */}
      <div className="tj-section-heading">
        <h2 className="tj-section-heading__text">The Happy Couple</h2>
        <OrnamentalDivider motif="diamond" width="30%" />
      </div>

      {/* Pointed arch photo frame */}
      <div className="tj-couple-arch">
        <MughalArch className="tj-couple-arch__svg" />
        {/* Photo placeholder — clip-path would be applied via CSS */}
        <div className="tj-couple-photo" aria-label="Couple photo placeholder" />
      </div>

      {/* Rose ornaments flanking the arch */}
      <div className="tj-couple-roses">
        <RoseMotif className="tj-couple-rose" size={48} />
        <RoseMotif className="tj-couple-rose" size={48} flip />
      </div>

      {/* Couple names */}
      <p className="tj-couple-names">
        {couple.brideName} &amp; {couple.groomName}
      </p>

      {/* Personal note / heading */}
      {heading && (
        <p className="tj-couple-note">{heading}</p>
      )}

      {/* Parents info */}
      <div className="tj-couple-person">
        <h3 className="tj-couple-person__name">{couple.brideFullName}</h3>
        {couple.brideParentLabel && (
          <p className="tj-couple-person__parents">
            {couple.brideParentLabel} {couple.brideFather} &amp; {couple.brideMother}
          </p>
        )}
      </div>

      <div className="tj-couple-divider">
        <span className="tj-couple-divider__line" />
        <span className="tj-couple-divider__icon">&amp;</span>
        <span className="tj-couple-divider__line" />
      </div>

      <div className="tj-couple-person">
        <h3 className="tj-couple-person__name">{couple.groomFullName}</h3>
        {couple.groomParentLabel && (
          <p className="tj-couple-person__parents">
            {couple.groomParentLabel} {couple.groomFather} &amp; {couple.groomMother}
          </p>
        )}
      </div>
    </section>
  )
}
