import type { RefObject } from 'react'
import type { CoupleInfo } from '../types'
import { MughalArch, ToranOrnaments, RoseCluster, LotusFlower, FloralBorder } from '../assets'

interface Props {
  couple: CoupleInfo
  monogram: string
  isOpen: boolean
  overlayRef: RefObject<HTMLDivElement | null>
  toranRef: RefObject<HTMLDivElement | null>
  onOpen: () => void
}

export default function Opening({
  couple,
  monogram,
  isOpen,
  overlayRef,
  toranRef,
  onOpen,
}: Props) {
  return (
    <section className="pp-opening" aria-label="Wedding invitation opening">
      {/* Layered background */}
      <div className="pp-opening__bg" />

      {/* Noise texture overlay */}
      <div className="pp-opening__texture" aria-hidden="true" />

      {/* Top floral garland */}
      <div className="pp-opening__canopy" aria-hidden="true">
        <FloralBorder variant="top" />
      </div>

      {/* Arch structure */}
      <MughalArch className="pp-opening__arch" />

      {/* Toran ornaments */}
      <div ref={toranRef} className="pp-opening__toran">
        <ToranOrnaments />
      </div>

      {/* Left floral cascade */}
      <div className="pp-opening__floral-left" aria-hidden="true">
        <RoseCluster size={90} />
        <RoseCluster size={70} style={{ marginTop: -20, marginLeft: 10 }} />
        <RoseCluster size={60} style={{ marginTop: -15, marginLeft: 5 }} />
      </div>

      {/* Right floral cascade */}
      <div className="pp-opening__floral-right" aria-hidden="true">
        <RoseCluster size={90} mirror />
        <RoseCluster size={70} mirror style={{ marginTop: -20, marginRight: 10 }} />
        <RoseCluster size={60} mirror style={{ marginTop: -15, marginRight: 5 }} />
      </div>

      {/* Monogram */}
      <div className="pp-opening__monogram" aria-label={`Monogram: ${monogram}`}>
        <span className="pp-opening__monogram-text">{monogram}</span>
      </div>

      {/* "Together with their families" */}
      <p className="pp-opening__subtitle">Together with their families</p>

      {/* Couple names */}
      <div className="pp-opening__names">
        <span className="pp-opening__name">{couple.groomName.split(' ')[0]}</span>
        <span className="pp-opening__ampersand">&</span>
        <span className="pp-opening__name">{couple.brideName.split(' ')[0]}</span>
      </div>

      {/* "Request the pleasure of your company" */}
      <p className="pp-opening__invitation-line">Request the pleasure of your company</p>

      {/* Center lotus */}
      <div className="pp-opening__lotus pp-lotus-breathe" aria-hidden="true">
        <LotusFlower size={56} />
      </div>

      {/* Bottom botanical border */}
      <div className="pp-opening__botanicals" aria-hidden="true">
        <FloralBorder variant="bottom" />
      </div>

      {/* Corner roses for extra density */}
      <div className="pp-opening__corner pp-opening__corner--tl" aria-hidden="true">
        <RoseCluster size={48} />
      </div>
      <div className="pp-opening__corner pp-opening__corner--tr" aria-hidden="true">
        <RoseCluster size={48} mirror />
      </div>

      {/* Tap to open overlay */}
      {!isOpen && (
        <div
          ref={overlayRef}
          className="pp-opening__overlay"
          onClick={onOpen}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpen()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Tap to open the wedding invitation"
        >
          <div className="pp-opening__overlay-inner">
            <div className="pp-opening__overlay-roses" aria-hidden="true">
              <RoseCluster size={64} />
            </div>
            <div className="pp-opening__overlay-monogram">{monogram}</div>
            <div className="pp-opening__overlay-roses" aria-hidden="true">
              <RoseCluster size={64} mirror />
            </div>
          </div>
          <div className="pp-opening__overlay-label">Tap to Open</div>
        </div>
      )}
    </section>
  )
}
