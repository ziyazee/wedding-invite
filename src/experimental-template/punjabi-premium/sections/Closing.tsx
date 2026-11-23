import type { CoupleInfo } from '../types'
import { ArchSilhouette, LotusFlower, RoseCluster } from '../assets'

interface Props {
  couple: CoupleInfo
}

export default function Closing({ couple }: Props) {
  return (
    <section className="pp-closing" aria-label="Closing message">
      {/* Corner florals */}
      <div className="pp-closing__roses pp-closing__roses--left" aria-hidden="true">
        <RoseCluster size={56} />
      </div>
      <div className="pp-closing__roses pp-closing__roses--right" aria-hidden="true">
        <RoseCluster size={56} mirror />
      </div>

      <div className="pp-closing__arch-wrapper">
        <ArchSilhouette
          className="pp-closing__arch-svg"
          strokeColor="#C9A84C"
          opacity={0.3}
        />

        <div className="pp-closing__content">
          <p className="pp-closing__phrase">With love and gratitude</p>

          <h2 className="pp-closing__names pp-script">
            {couple.groomName.split(' ')[0]} & {couple.brideName.split(' ')[0]}
          </h2>

          <div className="pp-closing__lotus pp-lotus-breathe" aria-hidden="true">
            <LotusFlower size={48} petalColor="#DECC8A" innerPetalColor="#C9A84C" leafColor="#7A9A6A" />
          </div>
        </div>
      </div>

      <footer className="pp-closing__footer">
        <p className="pp-closing__footer-text">
          Invitation by Shaadi Invites
        </p>
      </footer>
    </section>
  )
}
