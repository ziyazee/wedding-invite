import type { VenueInfo } from '../types'
import { IslamicArchSvg } from '../assets/svg'

interface Props {
  venue: VenueInfo
}

export default function Venue({ venue }: Props) {
  return (
    <section className="nn-section nn-section-venue">
      <div className="nn-section-inner">
        <div className="nn-venue-card">
          <IslamicArchSvg width={32} className="nn-venue-icon" />
          <h3 className="nn-venue-name">{venue.name}</h3>
          <p className="nn-venue-address">{venue.address}</p>
          <a
            href={venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nn-venue-link"
          >
            <MapPinIcon />
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  )
}

function MapPinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
