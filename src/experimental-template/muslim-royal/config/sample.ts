import type { WeddingData } from '../core'

/* Generic Muslim royal sample. Event titles keep the keywords (engagement, mehndi, music, nikah, walima)
   that the Celebrations section uses to pick each card's painted motif. */
export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Ayaan',
    brideName: 'Zoya',
    groomFullName: 'Ayaan Qureshi',
    brideFullName: 'Zoya Siddiqui',
    groomFather: 'Mr. Imran Qureshi',
    groomMother: 'Mrs. Nazia Qureshi',
    brideFather: 'Mr. Farhan Siddiqui',
    brideMother: 'Mrs. Rukhsar Siddiqui',
    groomParentLabel: 'Grandson of the late Mr. Abdul Qureshi, son of',
    brideParentLabel: 'Granddaughter of the late Mr. Yusuf Siddiqui, daughter of',
    groomPlace: 'Your City',
    bridePlace: 'Your City',
  },
  weddingDate: '2027-04-17T18:00:00',
  heading: 'With the blessings of Allah, and the love of our families, we invite you to the wedding of our beloved',
  blessing: 'May Allah bless you both, shower His blessings upon you, and unite you in goodness.',
  personalNote: 'Your presence is the finest gift. Come with your family, share the table, and pray with us for a lifetime of mercy and love.',
  celebrations: [
    {
      id: 'engagement',
      title: 'Engagement',
      date: '2027-04-12',
      time: '5:00 PM',
      venue: 'The Family Residence',
      address: '12 Garden Avenue, Your City',
      description: 'The families exchange gifts and sweets, and the rings are placed with prayer.',
    },
    {
      id: 'mehndi',
      title: 'Mehndi Evening',
      date: '2027-04-14',
      time: '4:00 PM onwards',
      venue: 'The Rose Courtyard',
      address: '12 Garden Avenue, Your City',
    },
    {
      id: 'music',
      title: 'Musical Night',
      date: '2027-04-15',
      time: '8:00 PM onwards',
      venue: 'The Family Residence',
      address: '12 Garden Avenue, Your City',
      description: 'Songs, laughter and music until the lamps burn low.',
    },
    {
      id: 'nikah',
      title: 'The Nikah Ceremony',
      date: '2027-04-17',
      time: '6:00 PM',
      venue: 'The Grand Palace Hall',
      address: '1 Palace Road, Your City',
    },
    {
      id: 'walima',
      title: 'Walima Reception',
      date: '2027-04-18',
      time: '8:00 PM',
      venue: 'The Royal Gardens',
      address: '1 Palace Road, Your City',
    },
  ],
}
