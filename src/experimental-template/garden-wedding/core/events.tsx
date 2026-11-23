/* Golden — shared event rendering. Celebrations (or any section) composes these. */

import type { ReactNode } from 'react'
import type { CelebrationEvent } from './types'

export function parseEventDate(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

export function formatEventDate(date: string): string {
  return parseEventDate(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDayMonth(date: string): { day: string; month: string } {
  const d = parseEventDate(date)
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
  }
}

interface EventCardProps {
  event: CelebrationEvent
  /** Extra controls under the address (map links, calendar links, ...). */
  actions?: ReactNode
  className?: string
}

export function EventCard({ event, actions, className = '' }: EventCardProps) {
  const { day, month } = formatDayMonth(event.date)
  return (
    <article className={`gw-event ${className}`} data-event-id={event.id}>
      <div className="gw-event__badge" aria-hidden="true">
        <span className="gw-event__day">{day}</span>
        <span className="gw-event__month">{month}</span>
      </div>
      <div className="gw-event__body">
        <h3 className="gw-event__title">{event.title}</h3>
        <p className="gw-event__when">
          {formatEventDate(event.date)}
          <span className="gw-event__sep" aria-hidden="true">·</span>
          {event.time}
        </p>
        <p className="gw-event__venue">{event.venue}</p>
        <p className="gw-event__address">{event.address}</p>
        {event.description ? <p className="gw-event__desc">{event.description}</p> : null}
        {actions}
      </div>
    </article>
  )
}

export function EventList({
  events,
  renderActions,
}: {
  events: CelebrationEvent[]
  renderActions?: (event: CelebrationEvent) => ReactNode
}) {
  return (
    <div className="gw-events">
      {events.map((event) => (
        <EventCard key={event.id} event={event} actions={renderActions?.(event)} />
      ))}
    </div>
  )
}
