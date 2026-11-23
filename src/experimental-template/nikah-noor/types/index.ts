export interface CoupleInfo {
  groomName: string
  brideName: string
  groomFullName: string
  brideFullName: string
  groomFather: string
  groomMother: string
  brideFather: string
  brideMother: string
  groomGrandfather?: string
  brideGrandfather?: string
}

export interface CelebrationEvent {
  id: string
  title: string
  date: string
  time: string
  venue: string
  address: string
  note?: string
  hijriDate?: string
}

export interface ContactPerson {
  name: string
  phone: string
  relation?: string
}

export interface VenueInfo {
  name: string
  address: string
  mapsUrl: string
  imageUrl?: string
}

export interface WeddingData {
  couple: CoupleInfo
  weddingDate: string
  hijriDate?: string
  hashtag?: string
  celebrations: CelebrationEvent[]
  venue: VenueInfo
  contacts: ContactPerson[]
  quranicVerse?: {
    arabic: string
    translation: string
    reference: string
  }
  blessing?: string
  closingBlessing?: {
    arabic: string
    translation: string
  }
  personalNote?: string
}
