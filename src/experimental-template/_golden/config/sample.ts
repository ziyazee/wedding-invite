import type { WeddingData } from '../core'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Rohan',
    brideName: 'Ananya',
    groomFullName: 'Rohan Mehta',
    brideFullName: 'Ananya Iyer',
    groomFather: 'Mr. Vikram Mehta',
    groomMother: 'Mrs. Sunita Mehta',
    brideFather: 'Mr. Suresh Iyer',
    brideMother: 'Mrs. Lakshmi Iyer',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
  },
  weddingDate: '2027-02-20T10:00:00',
  heading: 'Together with their families, invite you to celebrate the union of',
  blessing: 'May this union be blessed with endless love, laughter and togetherness.',
  personalNote:
    'Your presence is the greatest gift we could ask for. We look forward to celebrating this beautiful journey with you.',
  celebrations: [
    {
      id: 'mehndi',
      title: 'Mehndi & Sangeet',
      date: '2027-02-18',
      time: '4:00 PM onwards',
      venue: 'Taj Falaknuma Palace',
      address: 'Engine Bowli, Falaknuma, Hyderabad',
    },
    {
      id: 'haldi',
      title: 'Haldi',
      date: '2027-02-19',
      time: '10:00 AM',
      venue: 'Mehta Residence',
      address: 'Banjara Hills, Hyderabad',
    },
    {
      id: 'wedding',
      title: 'The Wedding',
      date: '2027-02-20',
      time: '10:00 AM',
      venue: 'Chowmahalla Palace',
      address: 'Motigalli, Khilwat, Hyderabad',
    },
    {
      id: 'reception',
      title: 'Reception',
      date: '2027-02-20',
      time: '7:30 PM onwards',
      venue: 'ITC Kohenur',
      address: 'HITEC City, Hyderabad',
    },
  ],
}
