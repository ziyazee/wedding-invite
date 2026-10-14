import { mapURL, type InvitationData } from './model'

export function invitationTemplateSrc(path: string, template: number, details: InvitationData | null) {
  if (!details) return path

  const event = details.events[0]
  const query = new URLSearchParams({
    template: String(template),
    groom: details.groom.trim().split(/\s+/)[0] || details.groom,
    bride: details.bride.trim().split(/\s+/)[0] || details.bride,
    date: event?.date || details.date,
    time: event?.time || details.time,
    event: event?.title || 'Wedding Celebration',
    venue: event?.venue || details.venue,
    address: event?.address || details.address,
    map: mapURL(event?.venue || details.venue, event?.address || details.address, event?.map || details.map),
    message: details.message,
    groomFamily: details.groomFamily,
    brideFamily: details.brideFamily,
    music: details.music,
  })

  return `${path}?${query.toString()}`
}
