import type { TemplateData } from '../types';

const sampleData: TemplateData = {
  couple: {
    bride: 'Ayesha',
    groom: 'Farhan',
    weddingDate: '2027-02-14',
    weddingTime: '16:30',
    weddingDateFormatted: 'Sunday, February 14, 2027',
    weddingTimeFormatted: 'at half past four in the evening',
  },
  groomFamily: {
    role: 'son',
    fatherName: 'Mr. Imran Ahmed Khan',
    motherName: 'Mrs. Rukhsana Khan',
    invitationMessage:
      'request the honour of your presence at the wedding of their beloved son',
  },
  brideFamily: {
    role: 'daughter',
    fatherName: 'Mr. Syed Arshad Ali',
    motherName: 'Mrs. Nadia Ali',
    invitationMessage:
      'request the honour of your presence at the wedding of their beloved daughter',
  },
  events: [
    {
      id: 'evt-nikah',
      name: 'Nikah',
      date: 'Sunday, February 14, 2027',
      time: '4:30 PM',
      venue: 'Grand Masjid Hall',
      address: '123 Heritage Lane, Lucknow',
      mapsUrl: 'https://maps.google.com',
      calendarUrl: '#',
    },
    {
      id: 'evt-walima',
      name: 'Walima',
      date: 'Monday, February 15, 2027',
      time: '7:00 PM',
      venue: 'Nawab Palace Banquets',
      address: '45 Chowk Road, Lucknow',
      mapsUrl: 'https://maps.google.com',
      calendarUrl: '#',
    },
    {
      id: 'evt-mehendi',
      name: 'Mehendi',
      date: 'Saturday, February 13, 2027',
      time: '5:00 PM',
      venue: 'Begum Residency Gardens',
      address: '78 Husainabad, Lucknow',
      mapsUrl: 'https://maps.google.com',
      calendarUrl: '#',
    },
  ],
  closing: {
    duaArabic: 'بَارَكَ اللهُ لَكَ وَبَارَكَ عَلَيكَ وَجَمَعَ بَينَكُمَا فِي خَيرٍ',
    duaEnglish:
      'May Allah bless you both and unite you in goodness',
    signoff: 'With love and duas,',
    families: 'The Khan & Ali Families',
  },
  rsvp: {
    enabled: true,
    onSubmit: (data) => {
      // eslint-disable-next-line no-console
      console.log('RSVP submitted:', data);
    },
  },
};

export default sampleData;
