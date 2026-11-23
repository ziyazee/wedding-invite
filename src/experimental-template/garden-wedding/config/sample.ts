import type { WeddingData } from '../core'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Kabir',
    brideName: 'Aarohi',
    groomFullName: 'Kabir Malhotra',
    brideFullName: 'Aarohi Kapoor',
    groomFather: 'Mr. Rajesh Malhotra',
    groomMother: 'Mrs. Neelam Malhotra',
    brideFather: 'Mr. Anil Kapoor',
    brideMother: 'Mrs. Seema Kapoor',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
  },
  weddingDate: '2027-02-21T11:00:00',
  heading: 'With the blessings of our elders, we invite you to celebrate the wedding of',
  blessing: 'शुभ विवाह · May this union bloom with love, laughter and togetherness.',
  personalNote:
    'Join us in the garden for music, marigolds and the seven pheras. Your presence is the greatest blessing we could ask for.',
  celebrations: [
    {
      id: 'mehendi',
      title: 'Mehendi',
      date: '2027-02-19',
      time: '4:00 PM onwards',
      venue: 'The Lawns, Kapoor Farmhouse',
      address: 'Chattarpur Farms, New Delhi',
    },
    {
      id: 'haldi',
      title: 'Haldi',
      date: '2027-02-20',
      time: '10:30 AM',
      venue: 'Kapoor Residence Garden',
      address: 'Greater Kailash II, New Delhi',
    },
    {
      id: 'sangeet',
      title: 'Sangeet',
      date: '2027-02-20',
      time: '7:30 PM onwards',
      venue: 'The Lawns, Kapoor Farmhouse',
      address: 'Chattarpur Farms, New Delhi',
    },
    {
      id: 'wedding',
      title: 'Baraat & Pheras',
      date: '2027-02-21',
      time: '11:00 AM',
      venue: 'Gulmohar Gardens',
      address: 'Mehrauli, New Delhi',
    },
    {
      id: 'reception',
      title: 'Reception',
      date: '2027-02-21',
      time: '8:00 PM onwards',
      venue: 'Gulmohar Gardens',
      address: 'Mehrauli, New Delhi',
    },
  ],
}
