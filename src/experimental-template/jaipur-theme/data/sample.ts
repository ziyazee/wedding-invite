import type { WeddingData } from '../types'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Vikram',
    brideName: 'Padmini',
    groomFullName: 'Vikram Singh Rathore',
    brideFullName: 'Padmini Devi Shekhawat',
    groomFather: 'Thakur Bhupendra Singh Rathore',
    groomMother: 'Rani Gayatri Devi Rathore',
    brideFather: 'Thakur Raghuveer Singh Shekhawat',
    brideMother: 'Rani Chandrakanta Devi Shekhawat',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
  },
  weddingDate: '2027-02-14T10:30:00',
  heading: 'Together with Their Families Request the Honour of Your Presence',
  blessing:
    'May the bond of love that unites you grow stronger with every sunrise over the Pink City.',
  shloka:
    'ॐ सह नाववतु। सह नौ भुनक्तु। सह वीर्यं करवावहै।',
  shlokaTranslation:
    'May we be protected together. May we be nourished together. May we work together with great energy.',
  celebrations: [
    {
      id: 'mehendi',
      title: 'Mehendi',
      date: '2027-02-12',
      time: '4:00 PM onwards',
      venue: 'Shekhawat Haveli',
      address: 'Nahargarh Road, Jaipur, Rajasthan',
    },
    {
      id: 'sangeet',
      title: 'Sangeet',
      date: '2027-02-13',
      time: '7:00 PM onwards',
      venue: 'Jai Mahal Palace',
      address: 'Jacob Road, Civil Lines, Jaipur',
    },
    {
      id: 'wedding',
      title: 'Wedding Ceremony',
      date: '2027-02-14',
      time: '10:30 AM (Shubh Muhurat)',
      venue: 'City Palace Courtyard',
      address: 'Tulsi Marg, Gangori Bazaar, Jaipur',
    },
    {
      id: 'reception',
      title: 'Reception',
      date: '2027-02-14',
      time: '7:00 PM onwards',
      venue: 'Rambagh Palace',
      address: 'Bhawani Singh Road, Jaipur',
    },
  ],
}
