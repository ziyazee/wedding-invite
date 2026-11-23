import type { CoupleInfo } from '../types'
import { ScallopedBorder, LotusFlower, GoldFlourish, RoseCluster } from '../assets'

interface Props {
  couple: CoupleInfo
}

export default function Couple({ couple }: Props) {
  return (
    <section className="pp-family" aria-label="Couple and family introduction">
      <ScallopedBorder cusps={7} className="pp-family__scallop-top" />
      <ScallopedBorder cusps={7} className="pp-family__scallop-bottom" />

      {/* Corner rose sprays — all four corners */}
      <div className="pp-family__roses pp-family__roses--top-left" aria-hidden="true">
        <RoseCluster size={64} />
      </div>
      <div className="pp-family__roses pp-family__roses--top-right" aria-hidden="true">
        <RoseCluster size={56} mirror />
      </div>
      <div className="pp-family__roses pp-family__roses--bottom-left" aria-hidden="true">
        <RoseCluster size={56} />
      </div>
      <div className="pp-family__roses pp-family__roses--bottom-right" aria-hidden="true">
        <RoseCluster size={64} mirror />
      </div>

      <div className="pp-family__inner">
        {couple.tagline && (
          <p className="pp-family__tagline">{couple.tagline}</p>
        )}

        <GoldFlourish
          style={{ width: '60%', maxWidth: 200, margin: '0 auto var(--pp-space-lg)' }}
        />

        <div className="pp-family__block">
          <h2 className="pp-family__name">{couple.groomName}</h2>
          <p className="pp-family__relation">Son of</p>
          <p className="pp-family__parents">{couple.groomParents}</p>
        </div>

        <div className="pp-family__divider" aria-hidden="true">
          <div className="pp-family__divider-line" />
          <LotusFlower size={32} />
          <div className="pp-family__divider-line" />
        </div>

        <div className="pp-family__block">
          <h2 className="pp-family__name">{couple.brideName}</h2>
          <p className="pp-family__relation">Daughter of</p>
          <p className="pp-family__parents">{couple.brideParents}</p>
        </div>

        <GoldFlourish
          style={{ width: '50%', maxWidth: 160, margin: 'var(--pp-space-lg) auto 0', transform: 'scaleY(-1)' }}
        />
      </div>
    </section>
  )
}
