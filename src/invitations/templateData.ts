import examples from '../data/template-invitations.json'
import type { InvitationData } from './model'

export const templateInvitationData = examples as Record<number, InvitationData>

for (const [id, groom, bride, venue] of [
  [9, 'Muhammed Shafi', 'Ayisha Nasrin', 'Taj Malabar Resort & Spa'],
  [10, 'Shafi', 'Ayisha', 'Taj Malabar Resort & Spa'],
  [11, 'Arjun', 'Priya', 'Umaid Bhawan Palace'],
  [12, 'Adarsh', 'Aastha', 'The Taj Palace'],
  [13, 'Mustafa', 'Zoya', 'Gulmohar Courtyard'],
  [14, 'Zayan', 'Alishba', 'Gulmohar Courtyard'],
] as const) {
  const base = examples[1]
  const address = id === 11 ? 'Jodhpur, Rajasthan' : id === 12 ? 'New Delhi' : id >= 13 ? 'Hyderabad' : 'Kochi, Kerala'
  templateInvitationData[id] = {
    ...base, template: id, groom, bride, venue, address,
    message: 'With the blessings of our families, we invite you to celebrate the beginning of our forever.',
    events: [{ id: 'wedding', title: id === 11 || id === 12 ? 'Wedding Ceremony' : 'Nikkah', date: base.date, time: base.time, venue, address, map: '' }],
  }
}

templateInvitationData[15] = {
  ...examples[1],
  template: 15,
  groom: 'Arjun',
  bride: 'Priya',
  date: '2027-02-14',
  venue: 'Royal Garden Venue',
  address: 'MG Road, Bandra West, Mumbai',
  events: [{
    id: 'wedding', title: 'Wedding Ceremony', date: '2027-02-14', time: '11:00',
    venue: 'Royal Garden Venue', address: 'MG Road, Bandra West, Mumbai', map: '',
  }],
}

templateInvitationData[16] = {
  ...examples[1],
  template: 16,
  groom: 'Navneet',
  bride: 'Jasleen',
  date: '2027-02-14',
  venue: 'Haveli Heritage',
  address: 'GT Road, Amritsar, Punjab',
  events: [{
    id: 'wedding', title: 'Wedding Ceremony', date: '2027-02-14', time: '11:00',
    venue: 'Haveli Heritage', address: 'GT Road, Amritsar, Punjab', map: '',
  }],
}

export function invitationExample(templateId: number): InvitationData | undefined {
  return templateInvitationData[templateId]
}

export function storeInvitationExample(
  templateId: number,
  demoData: Record<string, unknown> | null | undefined,
): InvitationData | undefined {
  const base = invitationExample(templateId)
  if (!base) return undefined
  if (!demoData || Object.keys(demoData).length === 0) return base
  return { ...base, ...demoData, template: templateId } as InvitationData
}
