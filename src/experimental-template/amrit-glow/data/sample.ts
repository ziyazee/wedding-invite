import type { WeddingData } from '../types'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Gurpreet',
    brideName: 'Harleen',
    groomFullName: 'Gurpreet Singh Sandhu',
    brideFullName: 'Harleen Kaur Brar',
    groomFather: 'S. Balwinder Singh Sandhu',
    groomMother: 'Smt. Manpreet Kaur Sandhu',
    brideFather: 'S. Jaswant Singh Brar',
    brideMother: 'Smt. Rajveer Kaur Brar',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
  },
  weddingDate: '2027-02-20T10:00:00',
  heading: 'Together with their families, invite you to celebrate the union of',
  blessing:
    'May Waheguru bless this union with eternal love, joy, and togetherness.',
  personalNote:
    'Your presence is the greatest gift we could ask for. We look forward to celebrating this beautiful journey with you.',
  celebrations: [
    {
      id: 'roka',
      title: 'Roka Ceremony',
      date: '2027-02-18',
      time: '11:00 AM',
      venue: 'Sandhu Residence',
      address: 'Model Town, Amritsar, Punjab',
    },
    {
      id: 'mehndi',
      title: 'Mehndi & Ladies Sangeet',
      date: '2027-02-19',
      time: '4:00 PM onwards',
      venue: 'Brar Haveli',
      address: 'Lawrence Road, Amritsar, Punjab',
    },
    {
      id: 'jaggo',
      title: 'Jaggo Night',
      date: '2027-02-19',
      time: '9:00 PM onwards',
      venue: 'Brar Haveli',
      address: 'Lawrence Road, Amritsar, Punjab',
    },
    {
      id: 'wedding',
      title: 'Anand Karaj',
      date: '2027-02-20',
      time: '10:00 AM',
      venue: 'Gurudwara Sri Guru Ram Das Ji',
      address: 'Near Golden Temple, Amritsar, Punjab',
    },
    {
      id: 'reception',
      title: 'Wedding Reception',
      date: '2027-02-20',
      time: '7:00 PM onwards',
      venue: 'Radisson Blu Hotel',
      address: 'GT Road, Amritsar, Punjab',
    },
  ],
}
