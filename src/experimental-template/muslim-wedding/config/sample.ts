import type { WeddingData } from '../core'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Zayd',
    brideName: 'Amira',
    groomFullName: 'Zayd Ahmed Khan',
    brideFullName: 'Amira Fatima Siddiqui',
    groomFather: 'Mr. Imran Khan',
    groomMother: 'Mrs. Nasreen Khan',
    brideFather: 'Mr. Farooq Siddiqui',
    brideMother: 'Mrs. Rukhsana Siddiqui',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
  },
  weddingDate: '2027-03-12T11:00:00',
  heading: 'With the blessings of Allah and their families, invite you to the Nikah of',
  blessing: 'Barakallahu lakuma wa baraka alaykuma wa jama\u2019a baynakuma fi khayr.',
  personalNote:
    'Your presence and your duas are the greatest gift we could ask for. We look forward to celebrating this blessed union with you.',
  celebrations: [
    {
      id: 'mehendi',
      title: 'Mehendi & Dholak Soir\u00e9e',
      date: '2027-03-10',
      time: '5:00 PM onwards',
      venue: 'Haveli Gulzar',
      address: 'Banjara Hills, Hyderabad',
    },
    {
      id: 'nikah',
      title: 'The Nikah',
      date: '2027-03-12',
      time: '11:00 AM',
      venue: 'Chowmahalla Palace',
      address: 'Motigalli, Khilwat, Hyderabad',
    },
    {
      id: 'walima',
      title: 'Walima Reception',
      date: '2027-03-13',
      time: '7:30 PM onwards',
      venue: 'Taj Falaknuma Palace',
      address: 'Engine Bowli, Falaknuma, Hyderabad',
    },
  ],
}
