import type { ReactNode } from 'react'
import type { InvitationData, Celebration } from '../invitations/model'
import { formatSellingPrice } from '../lib/orderPricing'
import { musicLabel } from '../invitations/musicCatalog'
import './InvitationReview.css'

function reviewTime(value: string) {
  const match = /^([01]?\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/.exec(value.trim())
  if (!match) return value
  const hour = Number(match[1])
  return `${hour % 12 || 12}:${match[2]} ${hour >= 12 ? 'PM' : 'AM'}`
}

type IconName = 'person' | 'family' | 'calendar' | 'pin' | 'phone' | 'note' | 'gift' | 'image' | 'clock' | 'dress' | 'rings' | 'celebrate' | 'document' | 'price'
const paths: Record<IconName, string> = {
  price: 'M6 4h12M6 8h12M7 4h3a5 5 0 0 1 0 10H7l9 7',
  person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM5 21v-3a7 7 0 0 1 14 0v3',
  family: 'M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21v-3a7 7 0 0 1 14 0v3M17 3a4 4 0 0 1 0 8m3 10v-3a7 7 0 0 0-3-6',
  calendar: 'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2ZM7 2v6m10-6v6M3 11h18',
  pin: 'M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 1 1 14 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  phone: 'm8 3 3 5-3 3a14 14 0 0 0 5 5l3-3 5 3c0 3-2 5-5 5C9 20 4 15 3 8c0-3 2-5 5-5Z',
  note: 'M4 3h16v15H9l-5 4V3Zm4 5h8M8 12h6',
  gift: 'M3 8h18v5H3V8Zm2 5v9h14v-9M12 8v14M12 8C4 8 5 0 9 3c2 1 3 5 3 5Zm0 0c8 0 7-8 3-5-2 1-3 5-3 5Z',
  image: 'M3 3h18v18H3V3Zm0 14 6-6 4 4 3-3 5 5M9 7h.01',
  clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 5v7l4 3',
  dress: 'M10 5a2 2 0 1 1 3 2l-1 1v3l9 6v3H3v-3l9-6',
  rings: 'M14 12a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm9 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
  celebrate: 'm4 2 6 2-2 7a3 3 0 0 1-6-2l2-7Zm1 12-2 7m-2-1 5 2M14 4l6-2 2 7a3 3 0 0 1-6 2l-2-7Zm5 10 2 7m-3 1 5-2M4 7l5 2m7 0 5-2',
  document: 'M5 2h9l5 5v15H5V2Zm9 0v6h5M8 12h8m-8 4h8',
}
function Icon({ name }: { name: IconName }) {
  return <span className="inv-review-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]}/></svg></span>
}
export function ReviewActionIcon({ edit = false }: { edit?: boolean }) {
  return <svg className="inv-review-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={edit ? 'm15 3 6 6M3 21l2-7L17 2a2 2 0 0 1 3 0l2 2a2 2 0 0 1 0 3L10 19l-7 2Z' : 'M15 12a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Zm7 0a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z'}/>
  </svg>
}
type Row = [string, string, IconName]
function Panel({ title, icon, rows, badge, children }: { title: string; icon: IconName; rows?: Row[]; badge?: string; children?: ReactNode }) {
  return <section className="inv-review-panel">
    <header><Icon name={icon}/><h3>{title}</h3>{badge && <span className="inv-review-badge"><Icon name="family"/>{badge}</span>}</header>
    {rows && <dl>{rows.map(([label, value, name]) => <div className="inv-review-row" key={label}><dt><Icon name={name}/><span>{label}</span></dt><dd>{value.trim() || '—'}</dd></div>)}</dl>}
    {children}
  </section>
}
export default function InvitationReview({ details, phone, title, events, template, sellingPrice }: { details: InvitationData; phone: string; title: string; events: Celebration[]; template: string; sellingPrice: number | null }) {
  return <section className="review-card inv-review" aria-label={`Review ${template} invitation details`}>
    <header className="inv-review-hero">
      <span>REVIEW ORDER DETAILS</span>
      <h2>{details.groom || 'Groom'} &amp; {details.bride || 'Bride'}</h2>
    </header>
    <div className="inv-review-grid">
      <div className="inv-review-column">
        <Panel title="Couple Information" icon="family" rows={[
          ['Groom’s name', details.groom, 'person'], ['Bride’s name', details.bride, 'person'],
          ['Groom’s family', details.groomFamily, 'family'], ['Bride’s family', details.brideFamily, 'family'],
          ...(details.showCoupleIllustrations === false ? [['Show bride & groom illustrations', 'No', 'image'] as Row] : []),
        ]}/>
        <Panel title="Additional Information" icon="document" rows={[
          ['Selling price', formatSellingPrice(sellingPrice), 'price'],
          ['Phone number', phone, 'phone'], ['Dress code', details.dressCode, 'dress'],
          ['Photo gallery', details.gallery, 'image'], ['Welcome message', details.message, 'note'],
          ['Short note', details.giftNote, 'gift'],
          ...(details.music.trim() ? [['Music', musicLabel(details.music), 'note'] as Row] : []),
        ]}/>
      </div>
      <div className="inv-review-column">
        <Panel title="Wedding Details" icon="rings" rows={[
          ['Wedding celebration', title, 'calendar'],
          ['Date & time', [details.date, reviewTime(details.time)].filter(Boolean).join(' · '), 'clock'],
          ['Venue & address', [details.venue, details.address].filter(Boolean).join(', '), 'pin'],
          ['Map link', details.map, 'pin'],
        ]}/>
        <Panel title="Celebrations" icon="celebrate">
          {events.length ? <ol className="inv-review-events">{events.map((event, index) => <li key={index}>
            <h4>{event.title || `Celebration ${index + 1}`}</h4>
            <div className="inv-review-event-meta">
              <span><Icon name="calendar"/>{event.date || '—'}</span>
              <span><Icon name="clock"/>{reviewTime(event.time) || '—'}</span>
              <span><Icon name="pin"/>{[event.venue, event.address].filter(Boolean).join(', ') || '—'}</span>
            </div>
            {event.map.trim() && <p className="inv-review-event-map">{event.map}</p>}
          </li>)}</ol> : <p className="inv-review-empty">No additional celebrations</p>}
        </Panel>
      </div>
    </div>
  </section>
}
