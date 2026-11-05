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

templateInvitationData[17] = {
  ...examples[1],
  template: 17,
  groom: 'Abu Bakr',
  bride: 'Zaryab',
  date: '2026-11-13',
  venue: 'The Grand Marquee',
  address: 'Hyderabad',
  groomFamily: 'G/o Late Mr. Aslam & S/o Late Mr. Jahangir & Mrs. Khushbakht',
  brideFamily: 'Gd/o Mrs. Kishwar Jahan & D/o Mr. Habib & Mrs. Shamsa',
  message: 'We are both so happy that you will be with us as we begin our life together. Since our engagement, the love and blessings we have received from our families and friends have touched us more deeply than we can say. We would like to thank each of you sincerely for your kindness, your warmth and your prayers. We would be honoured to have you with us at our wedding, and we look forward to celebrating with you.',
  events: [
    { id: 'celebration-1', title: 'Nikkah', date: '2026-11-13', time: '19:00', venue: 'The Grand Marquee', address: 'Hyderabad', map: '' },
    { id: 'celebration-2', title: 'The Walima Reception', date: '2026-11-14', time: '20:00', venue: 'The Serena Gardens', address: 'Hyderabad', map: '' },
  ],
}

templateInvitationData[18] = {
  ...examples[1],
  template: 18,
  groom: 'Arjun',
  bride: 'Meera',
  date: '2027-01-15',
  venue: 'Kumarakom Lake Resort',
  address: 'Kumarakom, Kottayam, Kerala',
  groomFamily: 'Mr. Rajesh Menon\nMrs. Lakshmi Menon',
  brideFamily: 'Mr. Suresh Nair\nMrs. Priya Nair',
  message: 'With the blessings of our families, we invite you to celebrate the beginning of our forever amidst the serene backwaters of Kerala.',
  events: ['Mehendi', 'Wedding Ceremony', 'Reception'].map((title, index) => ({
    id: `celebration-${index + 1}`, title, date: '2027-01-15', time: '11:00',
    venue: 'Kumarakom Lake Resort', address: 'Kumarakom, Kottayam, Kerala', map: '',
  })),
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
