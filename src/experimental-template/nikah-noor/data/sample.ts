import type { WeddingData } from '../types'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Shariq',
    brideName: 'Ifra',
    groomFullName: 'Sheikh Mohammed Shariq',
    brideFullName: 'Ifra Ayesha',
    groomFather: 'Mr Sheikh Abdul Samad',
    groomMother: 'Mrs Khurshid Abdul Samad',
    brideFather: 'Mr Khan Mohammed Siraj',
    brideMother: 'Mrs Siraj',
    groomGrandfather: 'Marhoom Sheikh Yusuf Saheb',
  },
  weddingDate: '2026-12-27T11:30:00',
  hijriDate: '18 Rajab ul Murajjab 1448 H',
  hashtag: '#SHAYERI',
  blessing:
    'Together with the blessings of the Almighty and the prayers of their families, request the honour of your presence at the Nikah ceremony of their beloved children.',
  celebrations: [
    {
      id: 'nikah',
      title: 'Nikah Ceremony',
      date: '2026-12-27',
      time: '11:30 AM',
      venue: 'Royal Palace',
      address: 'Ganjimutt, Mangalore',
      hijriDate: '18 Rajab ul Murajjab 1448 H',
      note: 'Followed by Reception',
    },
  ],
  venue: {
    name: 'Royal Palace',
    address: 'Ganjimutt, Mangalore, Karnataka',
    mapsUrl: 'https://maps.google.com/?q=Royal+Palace+Ganjimutt+Mangalore',
  },
  contacts: [
    { name: 'S M Shariq', phone: '9972800581', relation: 'Groom' },
    { name: 'Sheikh Abdul Samad', phone: '7259070478', relation: "Groom's Father" },
    { name: 'Sheikh Aahil', phone: '9995047877', relation: 'Family' },
  ],
  quranicVerse: {
    arabic:
      'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ',
    translation:
      'And among His signs is this, that He created for you mates from among yourselves, that you may dwell in tranquillity with them, and He has put love and mercy between your hearts. Verily in that are signs for those who reflect.',
    reference: 'Surah Ar-Rum · 30:21',
  },
  closingBlessing: {
    arabic: 'بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ',
    translation:
      'May Allah bless you both, and shower His blessings upon you, and unite you in goodness.',
  },
  personalNote:
    'Your presence is the greatest gift. We look forward to sharing this blessed day with you.',
}
