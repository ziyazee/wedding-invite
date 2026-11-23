import type { WeddingData } from '../types'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Arham',
    brideName: 'Aisha',
    groomFullName: 'Arham Syed Khan',
    brideFullName: 'Aisha Fatima Qureshi',
    groomFather: 'Mr. Syed Irfan Khan',
    groomMother: 'Mrs. Razia Khan',
    brideFather: 'Mr. Ahmed Qureshi',
    brideMother: 'Mrs. Nusrat Qureshi',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
  },
  weddingDate: '2027-02-20T11:00:00',
  heading: 'Together with their families invite you to celebrate the union of',
  dua: 'بارك الله لكما وبارك عليكما وجمع بينكما في خير',
  blessing:
    'May Allah bless this union with love, mercy, and barakah.',
  celebrations: [
    {
      id: 'mehndi',
      title: 'Mehndi',
      date: '2027-02-18',
      time: '5:00 PM onwards',
      venue: 'Khan Haveli',
      address: 'Jubilee Hills, Hyderabad',
    },
    {
      id: 'nikah',
      title: 'Nikah Ceremony',
      date: '2027-02-20',
      time: '11:00 AM',
      venue: 'Jama Masjid Hall',
      address: 'Charminar, Hyderabad',
    },
    {
      id: 'walima',
      title: 'Walima Reception',
      date: '2027-02-21',
      time: '7:00 PM onwards',
      venue: 'Taj Falaknuma Palace',
      address: 'Engine Bowli, Falaknuma, Hyderabad',
    },
  ],
}
