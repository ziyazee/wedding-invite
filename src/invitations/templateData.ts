import examples from '../data/template-invitations.json'
import type { InvitationData } from './model'

export const templateInvitationData = examples as Record<number, InvitationData>

for (const [id, groom, bride, venue] of [
  [9, 'Muhammed Shafi', 'Ayisha Nasrin', 'Taj Malabar Resort & Spa'],
  [10, 'Shafi', 'Ayisha', 'Taj Malabar Resort & Spa'],
  [11, 'Arjun', 'Priya', 'Umaid Bhawan Palace'],
] as const) {
  const base = examples[1]
  const address = id === 11 ? 'Jodhpur, Rajasthan' : 'Kochi, Kerala'
  templateInvitationData[id] = {
    ...base, template: id, groom, bride, venue, address,
    message: 'With the blessings of our families, we invite you to celebrate the beginning of our forever.',
    events: [{ id: 'wedding', title: id === 11 ? 'Wedding Ceremony' : 'Nikkah', date: base.date, time: base.time, venue, address, map: '' }],
  }
}

export function invitationExample(templateId: number): InvitationData | undefined {
  return templateInvitationData[templateId]
}
