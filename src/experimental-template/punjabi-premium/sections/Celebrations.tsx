import type { CelebrationEvent } from '../types'
import { ScallopedBorder, RoseCluster, GoldFlourish } from '../assets'

interface Props {
  events: CelebrationEvent[]
}

const EVENT_ICONS: Record<string, string> = {
  mehendi: '☘',    // shamrock/leaf
  sangeet: '♫',    // musical notes
  'anand-karaj': '❀', // flower
  reception: '✦',  // star
}

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function Celebrations({ events }: Props) {
  const isHighlight = (id: string) => id === 'anand-karaj'

  return (
    <section className="pp-celebrations" aria-label="Wedding celebrations">
      <h2 className="pp-celebrations__heading">Our Celebrations</h2>

      <GoldFlourish
        style={{ width: '50%', maxWidth: 180, margin: '0 auto var(--pp-space-lg)' }}
      />

      <div className="pp-celebrations__timeline">
        {/* Vertical gold line */}
        <div className="pp-celebrations__line" aria-hidden="true" />

        {events.map((event) => (
          <div
            key={event.id}
            className={`pp-event-card ${isHighlight(event.id) ? 'pp-event-card--highlight' : ''}`}
          >
            {/* Scalloped top */}
            <ScallopedBorder
              cusps={3}
              color={isHighlight(event.id) ? '#5C3529' : '#E8D5C0'}
              className="pp-event-card__scallop"
            />

            {/* Timeline node */}
            <div className="pp-celebrations__node" aria-hidden="true">
              <span className="pp-celebrations__node-icon">
                {EVENT_ICONS[event.id] || '✦'}
              </span>
            </div>

            {/* Floral corner */}
            <div className="pp-event-card__floral" aria-hidden="true">
              <RoseCluster size={20} />
            </div>

            {/* Content */}
            <h3 className="pp-event-card__name pp-script">{event.name}</h3>

            <div className="pp-event-card__meta">
              <span className="pp-event-card__date">{formatEventDate(event.date)}</span>
              <span className="pp-event-card__time">{event.time}</span>
            </div>

            <p className="pp-event-card__venue">{event.venue}</p>
            <p className="pp-event-card__address">{event.address}</p>

            {event.description && (
              <p className="pp-event-card__desc">{event.description}</p>
            )}

            <div className="pp-event-card__actions">
              <button
                type="button"
                className="pp-event-card__action-link"
                aria-label={`View ${event.venue} on map`}
              >
                View on Map
              </button>
              <button
                type="button"
                className="pp-event-card__action-link"
                aria-label={`Add ${event.name} to calendar`}
              >
                Add to Calendar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
