import type { CelebrationEvent } from '../types'
import { CrescentStarSvg } from '../assets/svg'

interface Props {
  celebrations: CelebrationEvent[]
}

function formatCeremonyDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Ceremony({ celebrations }: Props) {
  return (
    <section className="nn-section nn-section-ceremony">
      <div className="nn-section-inner">
        <CrescentStarSvg width={28} className="nn-gold-text" />
        <h2 className="nn-ceremony-title">Nikah</h2>

        {celebrations.map((event) => (
          <div key={event.id} className="nn-ceremony-card">
            <div className="nn-ceremony-row">
              <p className="nn-ceremony-field">Date</p>
              <p className="nn-ceremony-value">{formatCeremonyDate(event.date)}</p>
              {event.hijriDate && (
                <p className="nn-ceremony-secondary">{event.hijriDate}</p>
              )}
            </div>

            <div className="nn-ceremony-row">
              <p className="nn-ceremony-field">Time</p>
              <p className="nn-ceremony-value">{event.time}</p>
            </div>

            <div className="nn-ceremony-row">
              <p className="nn-ceremony-field">Venue</p>
              <p className="nn-ceremony-value">{event.venue}</p>
              <p className="nn-ceremony-secondary">{event.address}</p>
            </div>

            {event.note && (
              <p className="nn-ceremony-note">{event.note}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
