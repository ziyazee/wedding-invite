export interface CoupleInfo {
  groomName: string
  brideName: string
  groomParents: string
  brideParents: string
  groomFamily?: string
  brideFamily?: string
  tagline?: string
}

export interface CelebrationEvent {
  id: string
  name: string
  date: string
  time: string
  venue: string
  address: string
  description?: string
}

export interface RSVPEntry {
  guestName: string
  attending: 'yes' | 'no' | 'maybe'
  guestCount: number
  message?: string
}

export interface GalleryImage {
  src: string
  alt: string
  aspect?: 'portrait' | 'landscape' | 'square'
}

export interface WeddingData {
  couple: CoupleInfo
  weddingDate: string
  celebrations: CelebrationEvent[]
  gallery: GalleryImage[]
}
