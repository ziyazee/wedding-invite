import type { WeddingData } from '../types';

export const sampleData: WeddingData = {
  couple: {
    groomName: 'Arjun',
    brideName: 'Meera',
    groomFamily: 'Son of Mr. & Mrs. Vikram Malhotra',
    brideFamily: 'Daughter of Mr. & Mrs. Rajesh Sharma',
    groomFatherName: 'Vikram Malhotra',
    groomMotherName: 'Sunita Malhotra',
    brideFatherName: 'Rajesh Sharma',
    brideMotherName: 'Kavita Sharma',
  },
  weddingDate: '2027-02-14',
  tagline: 'Two hearts, one timeless journey',
  blessing:
    'May this union be blessed with love, laughter, and a lifetime of togetherness.',
  personalNote:
    'With hearts full of joy, we invite you to celebrate the beginning of our forever.',
  celebrations: [
    {
      id: 'mehndi',
      title: 'Mehndi Ceremony',
      date: '2027-02-12',
      time: '4:00 PM',
      venue: 'The Garden Pavilion',
      address: '15 Lotus Lane, Udaipur',
      description:
        'An afternoon of music, mehndi, and merriment as we begin the celebrations.',
      dressCode: 'Vibrant & Festive',
    },
    {
      id: 'sangeet',
      title: 'Sangeet Night',
      date: '2027-02-13',
      time: '7:00 PM',
      venue: 'Lake Palace Ballroom',
      address: '1 Palace Road, Udaipur',
      description:
        'A night of dance, song, and celebration under the stars.',
      dressCode: 'Glamorous Traditional',
    },
    {
      id: 'wedding',
      title: 'Wedding Ceremony',
      date: '2027-02-14',
      time: '10:00 AM',
      venue: 'Royal Heritage Mandap',
      address: '22 Heritage Boulevard, Udaipur',
      description:
        'The sacred ceremony where two souls become one — we request your gracious presence and blessings.',
      dressCode: 'Formal Traditional',
    },
    {
      id: 'reception',
      title: 'Grand Reception',
      date: '2027-02-14',
      time: '7:00 PM',
      venue: 'The Maharaja Hall',
      address: '22 Heritage Boulevard, Udaipur',
      description:
        'An evening of grandeur and celebration — dinner, music, and cherished company.',
      dressCode: 'Black Tie / Formal Indian',
    },
  ],
};
