import { lazy, Suspense } from 'react'
import type { InvitationData } from '../invitations/model'

const SecretGarden = lazy(() => import('./secret-garden/SecretGarden'))

const demo: InvitationData = {
  template: 5,
  groom: 'Clara', bride: 'Nour',
  date: '2026-10-03', time: '15:15', offset: '+02:00',
  venue: 'Mairie de Vauréal', address: 'Vauréal, France', map: 'https://maps.google.com/?q=Mairie+de+Vaureal',
  message: '',
  groomFamily: '', brideFamily: '',
  dressCode: 'Formal — Black tie',
  giftNote: '', music: '/design5/assets/autumn-wind.mp3', gallery: '',
  events: [
    { title: 'Wedding Ceremony', date: '2026-10-03', time: '15:15', venue: 'Mairie de Vauréal', address: 'Vauréal, France', map: 'https://maps.google.com/?q=Mairie+de+Vaureal' },
    { title: 'Reception', date: '2026-10-03', time: '18:00', venue: 'Château de Vauréal', address: 'Vauréal, France', map: '' },
  ],
}

export default function Design5() {
  return <Suspense fallback={<div style={{ minHeight: '100svh', background: '#EFE8DA' }} />}>
    <SecretGarden details={demo} />
  </Suspense>
}
