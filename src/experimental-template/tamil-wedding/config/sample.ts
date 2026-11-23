import type { WeddingData } from '../core'

/* Placeholder copy. Tamil lines are standard invitation phrasing and need a native-speaker review
   before any real use. */
export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Karthik',
    brideName: 'Meenakshi',
    groomFullName: 'Selvan Karthik Sundaram',
    brideFullName: 'Selvi Meenakshi Arunachalam',
    groomFather: 'Thiru. Sundaram',
    groomMother: 'Thirumathi. Valli Sundaram',
    brideFather: 'Thiru. Arunachalam',
    brideMother: 'Thirumathi. Janaki Arunachalam',
    groomParentLabel: 'Son of · Madurai',
    brideParentLabel: 'Daughter of · Karaikudi',
  },
  weddingDate: '2027-02-14T07:30:00',
  heading: 'With the grace of God and the blessings of our elders, we invite you to the wedding of',
  blessing: 'May this union be blessed with love, laughter and a lifetime of togetherness.',
  personalNote:
    'Come with your family and bless the couple. Your presence is the greatest gift we could ask for.',
  celebrations: [
    {
      id: 'nichayathartham',
      title: 'Nichayathartham',
      date: '2027-02-12',
      time: '10:30 AM',
      venue: 'Arunachalam Illam',
      address: 'Kanadukathan, Karaikudi, Tamil Nadu',
      description: 'The exchange of thamboolam that seals the engagement.',
    },
    {
      id: 'mappillai-azhaippu',
      title: 'Mappillai Azhaippu & Reception',
      date: '2027-02-13',
      time: '6:30 PM onwards',
      venue: 'Sri Meenakshi Kalyana Mandapam',
      address: 'West Masi Street, Madurai, Tamil Nadu',
    },
    {
      id: 'muhurtham',
      title: 'Subha Muhurtham',
      date: '2027-02-14',
      time: '7:30 AM – 9:00 AM',
      venue: 'Sri Meenakshi Kalyana Mandapam',
      address: 'West Masi Street, Madurai, Tamil Nadu',
      description: 'The thaali is tied to the sound of the nadaswaram and thavil.',
    },
    {
      id: 'nalangu',
      title: 'Nalangu',
      date: '2027-02-14',
      time: '4:00 PM',
      venue: 'Sundaram Illam',
      address: 'Anna Nagar, Madurai, Tamil Nadu',
    },
  ],
}
