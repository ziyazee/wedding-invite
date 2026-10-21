import type { SavedInvitation } from './model'

// Fictional showcase invitations with complete example details. These routes
// are source-backed so they work on static hosts without invitation storage.
export const showcaseInvitations: Record<string, SavedInvitation> = {
  arjunmeera: {
    slug: 'arjunmeera', createdAt: '2026-10-14T00:00:00.000Z', details: {
      template: 3, groom: 'Arjun Sharma', bride: 'Meera Iyer', date: '2027-02-21', time: '18:30', offset: '+05:30',
      venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '',
      message: 'With the blessings of our families, we invite you to join us as we celebrate our wedding and begin a new chapter together.',
      groomFamily: 'With love from the Sharma family', brideFamily: 'With love from the Iyer family',
      dressCode: 'Festive Indian attire in jewel tones is welcome.', giftNote: 'Your blessings and presence are the greatest gifts.', music: '', gallery: '',
      events: [
        { title: 'Ganesh Puja & family blessings', date: '2027-02-21', time: '08:30', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
        { title: 'Wedding ceremony & saat phere', date: '2027-02-21', time: '18:30', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
        { title: 'Dinner & celebration', date: '2027-02-21', time: '20:30', venue: 'The Garden Pavilion', address: 'Jaipur, Rajasthan, India', map: '' },
      ],
    },
  },
  rohankavya: {
    slug: 'rohankavya', createdAt: '2026-10-14T00:00:00.000Z', details: {
      template: 5, groom: 'Rohan Patel', bride: 'Kavya Desai', date: '2027-11-14', time: '17:00', offset: '+05:30',
      venue: 'Aangan Courtyard', address: 'Ahmedabad, Gujarat, India', map: '',
      message: 'Two families, one joyful celebration. Join us for the colors, music, and traditions that will lead us to our forever.',
      groomFamily: 'The Patel family', brideFamily: 'The Desai family',
      dressCode: 'Colorful festive attire. Please save white for the celebration décor.', giftNote: 'Your good wishes are all we ask for.', music: '', gallery: '',
      events: [
        { title: 'Mehendi & music', date: '2027-11-12', time: '17:00', venue: 'Aangan Courtyard', address: 'Ahmedabad, Gujarat, India', map: '' },
        { title: 'Haldi & family lunch', date: '2027-11-13', time: '11:00', venue: 'Aangan Courtyard', address: 'Ahmedabad, Gujarat, India', map: '' },
        { title: 'Wedding ceremony & pheras', date: '2027-11-14', time: '17:00', venue: 'Aangan Courtyard', address: 'Ahmedabad, Gujarat, India', map: '' },
        { title: 'Dinner & dancing', date: '2027-11-14', time: '20:00', venue: 'Aangan Courtyard', address: 'Ahmedabad, Gujarat, India', map: '' },
      ],
    },
  },
  aarongrace: {
    slug: 'aarongrace', createdAt: '2026-10-14T00:00:00.000Z', details: {
      template: 2, groom: 'Aaron D’Souza', bride: 'Grace Fernandes', date: '2027-06-19', time: '16:00', offset: '+05:30',
      venue: 'The Chapel by the Sea', address: 'Candolim, Goa, India', map: '',
      message: 'With grateful hearts and the blessings of our families, we invite you to witness our vows and celebrate the love that brings us together.',
      groomFamily: 'The D’Souza family', brideFamily: 'The Fernandes family',
      dressCode: 'Garden formal. Light, comfortable colors are welcome.', giftNote: 'Your presence is a gift. We are grateful to celebrate with you.', music: '', gallery: '',
      events: [
        { title: 'Wedding ceremony', date: '2027-06-19', time: '16:00', venue: 'The Chapel by the Sea', address: 'Candolim, Goa, India', map: '' },
        { title: 'Cocktails in the garden', date: '2027-06-19', time: '18:00', venue: 'The Palm Garden', address: 'Candolim, Goa, India', map: '' },
        { title: 'Dinner & reception', date: '2027-06-19', time: '19:30', venue: 'The Palm Garden', address: 'Candolim, Goa, India', map: '' },
      ],
    },
  },
  danielsarah: {
    slug: 'danielsarah', createdAt: '2026-10-14T00:00:00.000Z', details: {
      template: 7, groom: 'Daniel Thomas', bride: 'Sarah Mathew', date: '2027-12-04', time: '10:30', offset: '+05:30',
      venue: 'St. Mary’s Garden Church', address: 'Kochi, Kerala, India', map: '',
      message: 'Before God and the people we love, we will exchange our vows. Please join our families for a joyful day of faith, friendship, and celebration.',
      groomFamily: 'The Thomas family', brideFamily: 'The Mathew family',
      dressCode: 'Sunday best or festive formal attire.', giftNote: 'Your prayers and presence mean the world to us.', music: '', gallery: '',
      events: [
        { title: 'Holy Matrimony', date: '2027-12-04', time: '10:30', venue: 'St. Mary’s Garden Church', address: 'Kochi, Kerala, India', map: '' },
        { title: 'Family photographs & refreshments', date: '2027-12-04', time: '12:00', venue: 'The Lakeside Hall', address: 'Kochi, Kerala, India', map: '' },
        { title: 'Wedding reception', date: '2027-12-04', time: '18:00', venue: 'The Lakeside Hall', address: 'Kochi, Kerala, India', map: '' },
      ],
    },
  },
  kiranrahul: {
    slug: 'kiranrahul', createdAt: '2026-10-14T00:00:00.000Z', details: {
      template: 111, groom: 'Kiran Mehta', bride: 'Rahul Joshi', date: '2026-12-15', time: '19:00', offset: '+05:30',
      venue: 'Taj Hotel', address: 'Mumbai, Maharashtra, India', map: '',
      message: 'Some souls are destined to find each other, no matter how long the journey. Krishna and Radha’s story wasn’t just about falling in love—it was about finding peace in each other’s presence, strength in every challenge, and a home in each other’s hearts. Through every smile, every tear, and every moment in between, their love only grew deeper. Today, as they take the sacred vows of forever, they carry with them not only dreams of a beautiful future but also the blessings of everyone who has been part of their journey. With hearts full of love and gratitude, they invite you to celebrate the beginning of their forever.',
      groomFamily: 'The Mehta family', brideFamily: 'The Joshi family',
      dressCode: 'Festive Indian attire in jewel tones.', giftNote: 'Your presence is the only gift we need.', music: '/bisara.mp3', gallery: '',
      events: [
        { title: 'Mehendi Night', date: '2026-12-15', time: '19:00', venue: 'Taj Hotel', address: 'Mumbai, Maharashtra, India', map: '' },
        { title: 'Wedding Ceremony', date: '2026-12-16', time: '11:00', venue: 'Taj Hotel', address: 'Mumbai, Maharashtra, India', map: '' },
        { title: 'Reception', date: '2026-12-16', time: '19:00', venue: 'Taj Hotel', address: 'Mumbai, Maharashtra, India', map: '' },
      ],
    },
  },
  vikramananya: {
    slug: 'vikramananya', createdAt: '2026-10-14T00:00:00.000Z', details: {
      template: 1, groom: 'Vikram Reddy', bride: 'Ananya Nair', date: '2027-10-30', time: '18:00', offset: '+05:30',
      venue: 'Saffron Palace Gardens', address: 'Hyderabad, Telangana, India', map: '',
      message: 'With the blessings of our elders and the love of our families, we invite you to celebrate our wedding. Your presence will make our day brighter.',
      groomFamily: 'The Reddy family', brideFamily: 'The Nair family',
      dressCode: 'Traditional or festive formal attire. We would love to see bright colors.', giftNote: 'Your blessings are the most meaningful gift.', music: '', gallery: '',
      events: [
        { title: 'Ganesh puja & welcome', date: '2027-10-30', time: '09:00', venue: 'Saffron Palace Gardens', address: 'Hyderabad, Telangana, India', map: '' },
        { title: 'Wedding ceremony & mangalsutra', date: '2027-10-30', time: '18:00', venue: 'Saffron Palace Gardens', address: 'Hyderabad, Telangana, India', map: '' },
        { title: 'Dinner & family celebration', date: '2027-10-30', time: '20:30', venue: 'Saffron Palace Gardens', address: 'Hyderabad, Telangana, India', map: '' },
      ],
    },
  },
  nikhiladiti: {
    slug: 'nikhiladiti', createdAt: '2026-10-14T00:00:00.000Z', details: {
      template: 117, groom: 'Nikhil Mehta', bride: 'Aditi Kapoor', date: '2027-02-28', time: '17:30', offset: '+05:30',
      venue: 'Jai Mahal Palace', address: 'Jaipur, Rajasthan, India', map: '',
      message: 'With the blessings of Lord Ganesha and the love of our families, we invite you to join us as we exchange our vows and begin a life together.',
      groomFamily: 'The Mehta family', brideFamily: 'The Kapoor family',
      dressCode: 'Traditional Indian attire in rose, gold, or festive jewel tones is welcome.', giftNote: 'Your blessings and presence are the greatest gifts.', music: '/bisara.mp3', gallery: '',
      events: [
        { title: 'Haldi & Mehendi', date: '2027-02-27', time: '11:00', venue: 'Jai Mahal Palace', address: 'Jaipur, Rajasthan, India', map: '' },
        { title: 'Wedding Ceremony & Saat Phere', date: '2027-02-28', time: '17:30', venue: 'Jai Mahal Palace', address: 'Jaipur, Rajasthan, India', map: '' },
        { title: 'Reception & Dinner', date: '2027-02-28', time: '20:00', venue: 'Jai Mahal Palace', address: 'Jaipur, Rajasthan, India', map: '' },
      ],
    },
  },
}
