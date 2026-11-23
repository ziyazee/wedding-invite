import type { WeddingData } from '../core'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Angad',
    brideName: 'Meher',
    groomFullName: 'Angad Singh Gill',
    brideFullName: 'Meher Kaur Sandhu',
    groomFather: 'S. Harpreet Singh Gill',
    groomMother: 'Sardarni Jaswinder Kaur Gill',
    brideFather: 'S. Gurmeet Singh Sandhu',
    brideMother: 'Sardarni Paramjit Kaur Sandhu',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
  },
  weddingDate: '2027-02-20T10:00:00',
  heading: 'With the blessings of Waheguru, together with their families, invite you to the Anand Karaj of',
  blessing: 'May Waheguru bless this union with love, humility and a lifetime of togetherness. Chardi Kala.',
  personalNote:
    'Your presence and blessings are the greatest gift we could ask for. Come celebrate with us, with dhol, laughter and langar.',
  celebrations: [
    {
      id: 'maiyan',
      title: 'Maiyan & Vatna',
      date: '2027-02-17',
      time: '11:00 AM',
      venue: 'Gill Haveli',
      address: 'Majitha Road, Amritsar, Punjab',
    },
    {
      id: 'chooda',
      title: 'Chooda & Kalire',
      date: '2027-02-19',
      time: '10:00 AM',
      venue: 'Sandhu Residence',
      address: 'Model Town, Amritsar, Punjab',
    },
    {
      id: 'jaggo',
      title: 'Jaggo & Sangeet',
      date: '2027-02-19',
      time: '7:30 PM onwards',
      venue: 'Bagh-e-Anand Lawns',
      address: 'Ajnala Road, Amritsar, Punjab',
    },
    {
      id: 'anand-karaj',
      title: 'Milni & Anand Karaj',
      date: '2027-02-20',
      time: '10:00 AM',
      venue: 'Gurdwara Sahib & Bagh-e-Anand Lawns',
      address: 'Ajnala Road, Amritsar, Punjab',
    },
    {
      id: 'reception',
      title: 'Doli & Reception',
      date: '2027-02-20',
      time: '7:30 PM onwards',
      venue: 'The Royal Courtyard',
      address: 'Ranjit Avenue, Amritsar, Punjab',
    },
  ],
}
