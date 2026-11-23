import type { WeddingData } from '../core'

/* Faith-neutral Punjabi sample. The core ceremony is worded "The Wedding Ceremony" on purpose:
   Sikh and Hindu Punjabi families hold different rites, and the couple types their own. */
export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Arjun',
    brideName: 'Simran',
    groomFullName: 'Arjun Sandhu',
    brideFullName: 'Simran Khanna',
    groomFather: 'Mr. Rajinder Sandhu',
    groomMother: 'Mrs. Harjeet Sandhu',
    brideFather: 'Mr. Ashok Khanna',
    brideMother: 'Mrs. Neelam Khanna',
    groomParentLabel: 'Grandson of the late Mr. Gurdev Sandhu, son of',
    brideParentLabel: 'Granddaughter of the late Mr. Krishan Khanna, daughter of',
    groomPlace: 'Pind Ghanaur, Patiala',
    bridePlace: 'Model Town, Jalandhar',
  },
  weddingDate: '2027-02-14T11:00:00',
  heading: 'With the blessings of our elders, we invite you to the wedding of our beloved',
  blessing: 'Jug jug jeeo. May your home always be full, your fields always golden, and your hearts always together.',
  personalNote: 'A manja is kept for you in our vehra. Come with your family, stay for the songs, and bless the new beginning.',
  celebrations: [
    {
      id: 'roka',
      title: 'Roka & Shagun',
      date: '2027-02-10',
      time: '11:00 AM',
      venue: 'Sandhu Haveli',
      address: 'Pind Ghanaur, Patiala, Punjab',
      description: 'The families give their word, chhuare are shared, and a red chunni is placed with love.',
    },
    {
      id: 'maiyan',
      title: 'Maiyan & Vatna',
      date: '2027-02-11',
      time: '10:00 AM',
      venue: 'Khanna Residence',
      address: 'Model Town, Jalandhar, Punjab',
    },
    {
      id: 'mehndi',
      title: 'Mehndi & Giddha',
      date: '2027-02-12',
      time: '4:00 PM onwards',
      venue: 'The Garden Courtyard',
      address: 'Model Town, Jalandhar, Punjab',
    },
    {
      id: 'jaago',
      title: 'Jaago & Sangeet',
      date: '2027-02-13',
      time: '8:00 PM onwards',
      venue: 'Sandhu Haveli',
      address: 'Pind Ghanaur, Patiala, Punjab',
      description: 'The gaagar is lit, the dhol begins, and the whole lane wakes up to dance.',
    },
    {
      id: 'wedding',
      title: 'Milni & The Wedding Ceremony',
      date: '2027-02-14',
      time: '11:00 AM',
      venue: 'Sandhu Haveli',
      address: 'Pind Ghanaur, Patiala, Punjab',
    },
  ],
}
