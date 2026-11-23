import type { CoupleInfo } from '../types'
import { CrescentStarSvg } from '../assets/svg'

interface Props {
  couple: CoupleInfo
  closingBlessing?: {
    arabic: string
    translation: string
  }
}

export default function Closing({ couple, closingBlessing }: Props) {
  return (
    <section className="nn-section nn-section-closing">
      <div className="nn-section-inner">
        {closingBlessing && (
          <>
            <p className="nn-closing-arabic">{closingBlessing.arabic}</p>
            <p className="nn-closing-translation">{closingBlessing.translation}</p>
          </>
        )}

        <hr className="nn-rule nn-rule--wide" />

        <div className="nn-closing-names">
          <span>{couple.groomFullName}</span>
          <span className="nn-closing-amp">&</span>
          <span>{couple.brideFullName}</span>
        </div>

        <div style={{ marginTop: 28 }}>
          <CrescentStarSvg width={20} className="nn-gold-text" />
        </div>

        <p className="nn-footer">Made with love</p>
      </div>
    </section>
  )
}
