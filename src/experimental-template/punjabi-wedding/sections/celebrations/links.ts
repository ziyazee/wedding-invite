/* Celebrations — map and calendar links. Pure functions, no network. */

import type { CelebrationEvent } from '../../core'

const TIME_RE = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i
const DEFAULT_DURATION_MS = 3 * 3_600_000

const p2 = (n: number) => String(n).padStart(2, '0')
const stamp = (d: Date) =>
  `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}T${p2(d.getHours())}${p2(d.getMinutes())}00`
const dayStamp = (d: Date) => `${d.getFullYear()}${p2(d.getMonth() + 1)}${p2(d.getDate())}`

interface Span {
  start: Date
  end: Date
  allDay: boolean
}

/** startsAt/endsAt win. Otherwise date + the first clock time in `time`. No time found → all-day. */
export function getEventSpan(event: CelebrationEvent): Span {
  if (event.startsAt) {
    const start = new Date(event.startsAt)
    const end = event.endsAt ? new Date(event.endsAt) : new Date(start.getTime() + DEFAULT_DURATION_MS)
    return { start, end, allDay: false }
  }
  const [y, m, d] = event.date.split('-').map(Number)
  const match = TIME_RE.exec(event.time)
  if (!match) {
    const start = new Date(y, m - 1, d)
    return { start, end: new Date(y, m - 1, d + 1), allDay: true }
  }
  let hour = Number(match[1]) % 12
  if (match[3].toLowerCase() === 'pm') hour += 12
  const start = new Date(y, m - 1, d, hour, Number(match[2] ?? 0))
  return { start, end: new Date(start.getTime() + DEFAULT_DURATION_MS), allDay: false }
}

const place = (e: CelebrationEvent) => `${e.venue}, ${e.address}`

export function getMapLinks(event: CelebrationEvent): { google: string; apple: string } {
  const q = encodeURIComponent(place(event))
  return {
    google: event.mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${q}`,
    apple: `https://maps.apple.com/?q=${q}`,
  }
}

export function getGoogleCalendarUrl(event: CelebrationEvent, hosts?: string): string {
  const { start, end, allDay } = getEventSpan(event)
  const dates = allDay ? `${dayStamp(start)}/${dayStamp(end)}` : `${stamp(start)}/${stamp(end)}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: hosts ? `${event.title} — ${hosts}` : event.title,
    dates,
    location: place(event),
    details: event.description ?? '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')

export function buildIcs(event: CelebrationEvent, hosts?: string): string {
  const { start, end, allDay } = getEventSpan(event)
  const dtstamp = stamp(new Date())
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Golden Invite//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@golden-invite`,
    `DTSTAMP:${dtstamp}`,
    allDay ? `DTSTART;VALUE=DATE:${dayStamp(start)}` : `DTSTART:${stamp(start)}`,
    allDay ? `DTEND;VALUE=DATE:${dayStamp(end)}` : `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(hosts ? `${event.title} — ${hosts}` : event.title)}`,
    `LOCATION:${esc(place(event))}`,
    event.description ? `DESCRIPTION:${esc(event.description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}

/** Client-side .ics download. */
export function downloadIcs(event: CelebrationEvent, hosts?: string): void {
  const blob = new Blob([buildIcs(event, hosts)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.id}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
