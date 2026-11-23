import type { WeddingData } from '../types';

export const sampleData: WeddingData = {
  couple: {
    groomName: 'Ahmed',
    brideName: 'Fatima',
    groomFamily: 'Son of Mr. & Mrs. Khalid Hussain',
    brideFamily: 'Daughter of Mr. & Mrs. Tariq Ansari',
    groomFatherName: 'Khalid Hussain',
    groomMotherName: 'Rukhsana Hussain',
    brideFatherName: 'Tariq Ansari',
    brideMotherName: 'Shabana Ansari',
  },
  weddingDate: '2027-03-20',
  bismillah: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  tagline: 'Two souls, one beautiful journey',
  dua: {
    arabic: 'بَارَكَ ٱللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    translation:
      'May Allah bless you and shower His blessings upon you and bring you together in goodness.',
    source: 'Sunan Abu Dawud 2130',
  },
  personalNote:
    'With hearts full of joy and gratitude to the Almighty, we invite you to share in the celebration of our union.',
  celebrations: [
    {
      id: 'mehndi',
      title: 'Mehndi',
      date: '2027-03-18',
      time: '6:00 PM',
      venue: 'Noor Banquet Hall',
      address: '42 Garden Road, Hyderabad',
      description:
        'An evening of music, dance, and henna — join us as we celebrate with color and joy.',
      dressCode: 'Colorful & Festive',
    },
    {
      id: 'nikah',
      title: 'Nikah Ceremony',
      date: '2027-03-20',
      time: '11:00 AM',
      venue: 'Grand Mosque',
      address: '1 Masjid Lane, Old City, Hyderabad',
      description:
        'The sacred union — we request your gracious presence and blessings as we begin our journey together.',
      dressCode: 'Formal Traditional',
    },
    {
      id: 'walima',
      title: 'Walima Reception',
      date: '2027-03-21',
      time: '7:00 PM',
      venue: 'The Royal Palace Banquets',
      address: '88 Jubilee Hills, Hyderabad',
      description:
        'A grand reception to celebrate our new beginning — dinner, dessert, and cherished company.',
      dressCode: 'Semi-Formal / Traditional',
    },
  ],
};
