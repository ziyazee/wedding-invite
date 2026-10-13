export const designs = [
  { id: 2, name: 'Royal Grace', description: 'Sage and ivory stationery with pearls and delicate botanical relief.', route: '/design2', image: '/images/royal-grace/welcome.jpg', color: '#8b9274' },
  { id: 3, name: 'Embroidered Garden', description: 'Garden illustrations and soft embroidered textures.', route: '/design3', image: '/design3/assets/footer-chateau.png', color: '#dce2cd' },
  { id: 4, name: 'Blossom & Oud', description: 'A warm, ornate celebration with Moroccan-inspired details.', route: '/design4', image: '/design4/assets/flowers.png', color: '#ead3c0' },
  { id: 5, name: 'Secret Garden', description: 'Romantic garden scenery and delicate floral details.', route: '/design5', image: '/design5/assets/opened.jpg', color: '#d6d8c3' },
  { id: 6, name: 'Majestic', description: 'Pearl accents, chandeliers and grand garden scenes.', route: '/design6', image: '/design6/assets/hero-poster-DkA1j00-.jpg', color: '#e9dfca' },
  { id: 7, name: 'Bloom', description: 'Expressive florals and a beautifully animated welcome.', route: '/design7', image: '/design7/assets/welcome-flowers-Dy0evJgO.png', color: '#e9c9bd' },
  { id: 8, name: 'Noor · A Courtyard in Bloom', description: 'An original Muslim wedding invitation with a lattice-door reveal.', route: '/design8', image: '/design8/courtyard.png', color: '#d7dbc2' },
  { id: 9, name: 'Sunehri · The Golden Veil', description: 'An embroidered golden arch and a timeless ivory wedding story.', route: '/design9', image: '/design9/curtain-open.jpg', color: '#e9dfc9' },
  { id: 10, name: 'Yasmin · An Ivory Beginning', description: 'Silken curtains, white floral arches and an intimate ivory-and-sage celebration.', route: '/design10', image: '/design10/open.jpg', color: '#e8dfc8' },
] as const
export interface Celebration { title: string; date: string; time: string; venue: string; address: string; map: string }
export interface InvitationData {
  template: number; groom: string; bride: string; date: string; time: string; offset: string;
  venue: string; address: string; map: string; message: string; groomFamily: string; brideFamily: string;
  dressCode: string; giftNote: string; music: string; gallery: string; events: Celebration[];
}
export interface SavedInvitation { slug: string; details: InvitationData; createdAt: string }
export const weddingISO = (d: InvitationData) => `${d.date}T${d.time}:00${d.offset}`
export const formatDate = (date: string, options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) => new Date(`${date}T12:00:00Z`).toLocaleDateString('en-GB', { ...options, timeZone: 'UTC' })
export const formatTime = (time: string) => new Date(`2000-01-01T${time}:00Z`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
export const mapURL = (venue: string, address: string, url = '') => url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue}, ${address}`)}`
export function nameSlug(groom: string, bride: string) {
  return `${groom}${bride}`.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 80) || 'wedding'
}
export const reservedSlugs = new Set(['assets','images','fonts','dashboard','create','preview','invite','newdesign','mohadrahma','api','arjunmeera','rohankavya','aarongrace','danielsarah','vikramananya',...designs.map(d => `design${d.id}`)])
export function validateDetails(value: unknown, allowRetired = false): InvitationData {
  if (!value || typeof value !== 'object') throw new Error('Invitation details are required.')
  const d = value as InvitationData
  if (!designs.some(t => t.id === d.template) && !(allowRetired && d.template === 1)) throw new Error('Choose an available invitation template.')
  const text = (v: unknown, label: string, max: number, required = false) => {
    if (typeof v !== 'string' || v.length > max || (required && !v.trim())) throw new Error(`Please enter a valid ${label}.`)
    return v.trim()
  }
  const date = (v: unknown) => {
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v) || !Number.isFinite(Date.parse(`${v}T12:00:00Z`)) || new Date(`${v}T12:00:00Z`).toISOString().slice(0,10) !== v) throw new Error('Enter a valid event date.')
    return v
  }
  const time = (v: unknown) => {
    if (typeof v !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(v)) throw new Error('Enter a valid event time.')
    return v
  }
  const url = (v: unknown, label: string) => {
    const s = text(v, label, 2000)
    if (s && !/^https?:\/\//i.test(s)) throw new Error(`${label} must start with https:// or http://.`)
    if (s) { const parsed = new URL(s); if (parsed.username || parsed.password) throw new Error(`Invalid ${label}.`) }
    return s
  }
  if (typeof d.offset !== 'string' || !/^[+-](0\d|1[0-4]):(00|15|30|45)$/.test(d.offset)) throw new Error('Choose a valid time zone offset.')
  if (!Array.isArray(d.events) || d.events.length < 1 || d.events.length > 10) throw new Error('Add between one and ten celebrations.')
  return {
    template:d.template, groom:text(d.groom,'groom name',80,true), bride:text(d.bride,'bride name',80,true), date:date(d.date), time:time(d.time), offset:d.offset,
    venue:text(d.venue,'venue',160,true),address:text(d.address,'address',300,true),map:url(d.map,'map link'),
    message:text(d.message,'welcome message',2000),groomFamily:text(d.groomFamily,'groom family',200),brideFamily:text(d.brideFamily,'bride family',200),
    dressCode:text(d.dressCode,'dress code',600),giftNote:text(d.giftNote,'gift note',600),music:url(d.music,'music link'),gallery:url(d.gallery,'gallery link'),
    events:d.events.map(e=>({title:text(e.title,'celebration name',100,true),date:date(e.date),time:time(e.time),venue:text(e.venue,'celebration venue',160,true),address:text(e.address,'celebration address',300,true),map:url(e.map,'map link')})),
  }
}
