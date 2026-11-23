import type { InvitationData } from '../types';

// Wedding date set ~3 months in the future from late 2026
const weddingDate = new Date(2027, 1, 14, 19, 0, 0); // Feb 14, 2027, 7 PM

const sampleData: InvitationData = {
  groomName: 'Arjun',
  brideName: 'Priya',
  welcomeLabel: 'Padharo Mhare Desh',
  welcomeMessage:
    'With the blessings of Lord Ganesh and our beloved families, we invite you to witness the sacred union of two souls under the golden skies of Rajasthan. May the colours of our joy fill your heart as we begin this beautiful journey together.',
  weddingDate,
  weddingDateDisplay: 'Saturday, 14th February 2027',
  weddingDay: 'Saturday',
  weddingTime: 'Seven in the evening',
  groomFamily: {
    label: "Groom's Family",
    members: [
      { name: 'Shri Vikram Singh Rathore', description: 'Father of the Groom' },
      { name: 'Smt. Padmini Rathore', description: 'Mother of the Groom' },
    ],
  },
  brideFamily: {
    label: "Bride's Family",
    members: [
      { name: 'Shri Rajendra Shekhawat', description: 'Father of the Bride' },
      { name: 'Smt. Gayatri Shekhawat', description: 'Mother of the Bride' },
    ],
  },
  events: [
    {
      id: 'evt-1',
      type: 'Ceremony',
      name: 'Mehendi',
      date: 'Thursday, 11th February 2027',
      time: '4:00 PM onwards',
      venue: 'Rathore Haveli',
      address: ['Near Hawa Mahal Road', 'Jaipur, Rajasthan 302002'],
      mapUrl: 'https://maps.google.com/?q=Hawa+Mahal+Road+Jaipur',
    },
    {
      id: 'evt-2',
      type: 'Celebration',
      name: 'Sangeet Night',
      date: 'Friday, 12th February 2027',
      time: '7:00 PM onwards',
      venue: 'Jai Mahal Palace',
      address: ['Jacob Road, Civil Lines', 'Jaipur, Rajasthan 302006'],
      mapUrl: 'https://maps.google.com/?q=Jai+Mahal+Palace+Jaipur',
    },
    {
      id: 'evt-3',
      type: 'Ceremony',
      name: 'Wedding Ceremony',
      date: 'Saturday, 14th February 2027',
      time: '7:00 PM',
      venue: 'City Palace Courtyard',
      address: ['Jaleb Chowk, Tripolia Bazar', 'Jaipur, Rajasthan 302002'],
      mapUrl: 'https://maps.google.com/?q=City+Palace+Jaipur',
    },
    {
      id: 'evt-4',
      type: 'Reception',
      name: 'Wedding Reception',
      date: 'Sunday, 15th February 2027',
      time: '7:30 PM onwards',
      venue: 'Rambagh Palace',
      address: ['Bhawani Singh Road', 'Jaipur, Rajasthan 302005'],
      mapUrl: 'https://maps.google.com/?q=Rambagh+Palace+Jaipur',
    },
  ],
  rsvpMessage: 'We would be honoured by your presence at our celebration.',
  closingMessage:
    'Your presence is the greatest gift we could ask for. We look forward to celebrating this beautiful beginning with you and your loved ones.',
  hashtag: '#ArjunWedsPriva',
};

export default sampleData;
