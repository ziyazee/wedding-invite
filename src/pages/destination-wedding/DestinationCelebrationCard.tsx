import type { Celebration } from '../../invitations/model'
import { formatDate, formatTime, mapURL } from '../../invitations/model'
import './DestinationCelebrationCard.css'

function FloralCorner({ className }: { className: string }) {
  return <svg className={`destination-floral ${className}`} viewBox="0 0 250 230" aria-hidden="true">
    <g fill="none" stroke="#8b805d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 207C71 169 92 126 119 76c19-35 51-55 89-65M43 188c22-4 46-2 66 9M76 140c-2-21-13-39-29-53M108 92c23 0 42 8 58 23M139 56c-1-17-9-33-22-44" />
      <path d="M57 179c-5-17-20-31-40-35 3 20 17 35 40 35ZM85 127c-5-19-18-32-38-39 3 21 17 34 38 39ZM111 91c17-11 24-28 22-47-19 11-27 27-22 47ZM145 61c14-17 16-35 9-53-15 16-18 34-9 53ZM101 188c17-15 36-18 56-10-15 17-33 22-56 10ZM165 92c18-8 37-5 52 8-19 10-38 8-52-8Z" fill="#a3a17c" />
    </g>
    <g fill="#fff8e8" stroke="#c6a56e" strokeWidth="2">
      <path d="M170 105c-22-8-22-26-5-30-5-20 10-29 22-14 16-14 31-2 21 14 19 5 17 24-4 30-1 21-20 26-29 8-20 11-34-2-20-19Z" />
      <path d="M89 177c-20-7-20-24-4-28-4-18 9-26 21-13 14-13 28-2 19 13 18 5 16 22-4 28-1 19-18 24-27 8-18 10-31-2-18-18Z" />
    </g>
    <g fill="#c69b48"><circle cx="190" cy="91" r="5"/><circle cx="112" cy="164" r="4"/><circle cx="184" cy="83" r="2"/><circle cx="198" cy="96" r="2"/><circle cx="106" cy="158" r="2"/><circle cx="117" cy="168" r="2"/></g>
  </svg>
}

function LotusMark() {
  return <svg className="destination-lotus" viewBox="0 0 72 48" aria-hidden="true">
    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M36 39C21 29 17 18 23 8c8 6 12 14 13 24 1-10 5-18 13-24 6 10 2 21-13 31Z" />
      <path d="M36 39C24 38 13 34 7 27c9-4 19-3 29 5 10-8 20-9 29-5-6 7-17 11-29 12ZM36 39V16" />
    </g>
  </svg>
}

export function DestinationCelebrationCard({ event, eventKey, dressCode = '' }: { event: Celebration; eventKey: string; dressCode?: string }) {
  const map = event.map.trim() ? event.map : mapURL(event.venue, event.address)
  const address = event.address.trim() && event.address.trim() !== event.venue.trim() ? event.address : ''
  const textId = (field: string) => `t12.event-${eventKey}.${field}`

  return <article className="destination-celebration-card" aria-label={`${event.title} details`}>
    <div className="destination-card-border" aria-hidden="true" />
    <div className="destination-paper-arch">
      <div className="destination-paper-inner">
        <FloralCorner className="destination-floral-top" />
        <FloralCorner className="destination-floral-bottom" />
        <div className="destination-card-content">
          <LotusMark />
          <h2 data-invite-text={textId('title')} data-invite-label={`Celebration ${eventKey} · title`}>{event.title}</h2>
          <div className="destination-divider" aria-hidden="true"><span /><i>◇</i><span /></div>
          <p className="destination-event-date" data-invite-text={textId('date')} data-invite-label={`Celebration ${eventKey} · date`}>{formatDate(event.date, { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
          <p className="destination-event-venue" data-invite-text={textId('venue')} data-invite-label={`Celebration ${eventKey} · venue`}>{event.venue}</p>
          {address && <p className="destination-event-address" data-invite-text={textId('address')} data-invite-label={`Celebration ${eventKey} · address`}>{address}</p>}
          {event.time && <p className="destination-event-time" data-invite-text={textId('time')} data-invite-label={`Celebration ${eventKey} · time`}>{formatTime(event.time)}</p>}
          {dressCode.trim() && <p className="destination-dress-code"><strong>Dress Code:</strong> <span data-invite-text={textId('dressCode')} data-invite-label={`Celebration ${eventKey} · dress code`}>{dressCode}</span></p>}
          {map && <a className="destination-route-link" data-invite-text={textId('directions')} data-invite-label={`Celebration ${eventKey} · directions`} href={map} target="_blank" rel="noreferrer">See the route <span aria-hidden="true">→</span></a>}
        </div>
      </div>
    </div>
  </article>
}
