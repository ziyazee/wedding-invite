import { mapURL, type InvitationData } from './model'

export function invitationTemplateSrc(path: string, template: number, details: InvitationData | null) {
  if (!details) return path

  const event = details.events[0]
  const firstName = details.brideFirst ? details.bride : details.groom
  const secondName = details.brideFirst ? details.groom : details.bride
  const firstFamily = details.brideFirst ? details.brideFamily : details.groomFamily
  const secondFamily = details.brideFirst ? details.groomFamily : details.brideFamily
  const query = new URLSearchParams({
    template: String(template),
    groom: firstName.trim().split(/\s+/)[0] || firstName,
    bride: secondName.trim().split(/\s+/)[0] || secondName,
    date: event?.date || details.date,
    time: event?.time || details.time,
    event: event?.title || 'Wedding Celebration',
    venue: event?.venue || details.venue,
    address: event?.address || details.address,
    map: mapURL(event?.venue || details.venue, event?.address || details.address, event?.map || details.map),
    message: details.message,
    groomFamily: firstFamily,
    brideFamily: secondFamily,
    music: details.music,
  })

  return `${path}?${query.toString()}`
}
