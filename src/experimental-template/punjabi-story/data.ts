// Sample content. The journey only presents this data; it never decides what it says.
export type JourneyEvent = {
  id: string
  motif: 'dhol' | 'henna' | 'chooda' | 'laddoo'
  name: string
  day: string
  time: string
  note: string
}

export const content = {
  groom: 'Harpreet',
  bride: 'Simran',
  dateLabel: '14 February 2027',
  dateISO: '2027-02-14T10:00:00+05:30',
  venueName: 'Dhillon Haveli',
  venueAddress: 'Pakhowal Road, Ludhiana, Punjab',
  mapQuery: 'Pakhowal Road Ludhiana Punjab',
  groomFamily: {
    label: 'The groom’s family',
    lines: ['Sardar Gurmeet Singh', '& Smt. Jaswinder Kaur', 'request the pleasure of your company'],
  },
  brideFamily: {
    label: 'The bride’s family',
    lines: ['Sardar Balwinder Singh', '& Smt. Manpreet Kaur', 'welcome you with open arms'],
  },
  events: [
    { id: 'jaago', motif: 'dhol', name: 'Jaago Night', day: 'Friday, 12 February', time: '7:00 PM', note: 'Dhol, boliyan and a lantern-lit walk through the village.' },
    { id: 'mehndi', motif: 'henna', name: 'Mehndi', day: 'Saturday, 13 February', time: '11:00 AM', note: 'Henna, songs and a long lunch in the courtyard.' },
    { id: 'wedding', motif: 'chooda', name: 'Wedding Ceremony', day: 'Sunday, 14 February', time: '10:00 AM', note: 'The chooda, the vows and blessings from every elder.' },
    { id: 'reception', motif: 'laddoo', name: 'Sweets & Reception', day: 'Sunday, 14 February', time: '8:00 PM', note: 'Dinner under the stars, with sweets for everyone.' },
  ] satisfies JourneyEvent[],
  blessing: 'ਜੀ ਆਇਆਂ ਨੂੰ',
  blessingLatin: 'Ji aayan nu: you are most welcome',
} as const
