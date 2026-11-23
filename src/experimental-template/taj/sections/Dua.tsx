import { useRef } from 'react'
import { JaliPattern, OrnamentalDivider } from '../assets'

interface Props {
  dua?: string
  blessing?: string
}

export default function Dua({ dua, blessing }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="tj-dua">
      {/* Jali lattice background at 4% opacity */}
      <JaliPattern className="tj-dua__lattice" opacity={0.04} />

      <div className="tj-dua__content">
        {/* Section heading */}
        <div className="tj-section-heading">
          <h2 className="tj-section-heading__text">Dua</h2>
          <OrnamentalDivider motif="diamond" width="30%" />
        </div>

        {/* Arabic dua text */}
        {dua && (
          <p className="tj-dua-arabic" dir="rtl" lang="ar">
            {dua}
          </p>
        )}

        {/* Thin gold rule separator */}
        <div className="tj-dua-rule" />

        {/* English translation */}
        {blessing && (
          <p className="tj-dua-translation">
            &ldquo;{blessing}&rdquo;
          </p>
        )}

        {/* Surah reference */}
        <p className="tj-dua-reference">
          &mdash; Surah Ar-Rum 30:21
        </p>
      </div>
    </section>
  )
}
