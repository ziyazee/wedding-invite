import { useRef } from 'react'
import type { CelebrationEvent } from '../types'
import { JaliPattern, EventCardArch, OrnamentalDivider } from '../assets'

interface Props {
  events: CelebrationEvent[]
}

export default function Celebrations({ events }: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section ref={sectionRef} className="tj-celebrations">
      {/* Jali lattice background at 3% opacity */}
      <JaliPattern className="tj-celebrations__lattice" opacity={0.03} />

      <div className="tj-celebrations__content">
        {/* Section heading */}
        <div className="tj-section-heading">
          <h2 className="tj-section-heading__text">Celebrations</h2>
          <OrnamentalDivider motif="diamond" width="30%" />
        </div>

        {/* Event cards */}
        <div className="tj-celebrations__list">
          {events.map((evt) => {
            const dateObj = new Date(evt.date + 'T00:00:00')
            const formatted = dateObj.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
            const isNikah = evt.id === 'nikah' || evt.title.toLowerCase().includes('nikah')

            return (
              <article
                key={evt.id}
                className={`tj-event-card${isNikah ? ' tj-event-card--primary' : ''}`}
              >
                {/* Arch header decoration */}
                <EventCardArch className="tj-event-card__arch" highlight={isNikah} />

                <div className="tj-event-card__body">
                  <h3 className="tj-event-card__title">{evt.title}</h3>
                  <p className="tj-event-card__date">{formatted}</p>
                  <p className="tj-event-card__time">{evt.time}</p>
                  <p className="tj-event-card__venue">{evt.venue}</p>
                  <p className="tj-event-card__address">{evt.address}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
