import type { WeddingData } from '../types'

export const sampleWedding: WeddingData = {
  couple: {
    groomName: 'Arjun',
    brideName: 'Devika',
    groomFullName: 'Arjun Krishnan Nair',
    brideFullName: 'Devika Raghavan Menon',
    groomFather: 'Mr. Krishnan Nair',
    groomMother: 'Mrs. Lakshmi Nair',
    brideFather: 'Mr. Raghavan Menon',
    brideMother: 'Mrs. Priya Menon',
    groomParentLabel: 'Son of',
    brideParentLabel: 'Daughter of',
  },
  weddingDate: '2027-03-15T06:30:00',
  heading: 'The Families Invite You to the Wedding Celebration of',
  blessing:
    'May the light that brought us together continue to guide your journey as one.',
  celebrations: [
    {
      id: 'nischayam',
      title: 'Nischayam',
      date: '2027-03-13',
      time: '10:00 AM',
      venue: 'Nair Tharavad',
      address: 'Aranmula, Pathanamthitta, Kerala',
    },
    {
      id: 'mehendi',
      title: 'Mylanchi Idal',
      date: '2027-03-14',
      time: '4:00 PM onwards',
      venue: 'Nair Tharavad',
      address: 'Aranmula, Pathanamthitta, Kerala',
    },
    {
      id: 'wedding',
      title: 'Vivaaham',
      date: '2027-03-15',
      time: '6:30 AM (Muhurtham)',
      venue: 'Guruvayur Sreekrishna Temple',
      address: 'Guruvayur, Thrissur, Kerala',
    },
    {
      id: 'reception',
      title: 'Sadhya & Reception',
      date: '2027-03-15',
      time: '12:00 PM onwards',
      venue: 'Kadavu Resort',
      address: 'Kozhikode, Kerala',
    },
  ],
}
