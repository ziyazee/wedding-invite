import type { CoupleInfo } from '../types'
import { OrnamentDividerSvg } from '../assets/svg'

interface Props {
  couple: CoupleInfo
  blessing?: string
}

export default function Invitation({ couple, blessing }: Props) {
  return (
    <section className="nn-section nn-section-invitation">
      <div className="nn-section-inner">
        <p className="nn-bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        <p className="nn-bismillah-sub">In the name of Allah, the Most Gracious, the Most Merciful</p>

        {blessing && <p className="nn-invitation-text">{blessing}</p>}

        <div className="nn-ornament">
          <OrnamentDividerSvg width={120} />
        </div>

        <div className="nn-family-block">
          <p className="nn-family-label">Groom's family</p>
          <p className="nn-family-parents">
            {couple.groomFather}<br />& {couple.groomMother}
          </p>
          {couple.groomGrandfather && (
            <p className="nn-family-grandparent">Grand S/O {couple.groomGrandfather}</p>
          )}
        </div>

        <div className="nn-family-block">
          <p className="nn-family-label">Bride's family</p>
          <p className="nn-family-parents">
            {couple.brideFather}<br />& {couple.brideMother}
          </p>
          {couple.brideGrandfather && (
            <p className="nn-family-grandparent">Grand D/O {couple.brideGrandfather}</p>
          )}
        </div>

        <div className="nn-couple-intro">
          <p className="nn-couple-label">Request the honour of your presence at the Nikah of</p>
          <p className="nn-couple-display">{couple.groomFullName}</p>
          <span className="nn-couple-amp">&</span>
          <p className="nn-couple-display">{couple.brideFullName}</p>
        </div>
      </div>
    </section>
  )
}
