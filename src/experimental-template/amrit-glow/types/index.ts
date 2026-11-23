export interface CoupleInfo {
  groomName: string
  brideName: string
  groomFullName: string
  brideFullName: string
  groomFather: string
  groomMother: string
  brideFather: string
  brideMother: string
  groomParentLabel?: string
  brideParentLabel?: string
}

export interface CelebrationEvent {
  id: string
  title: string
  date: string
  time: string
  venue: string
  address: string
}

export interface WeddingData {
  couple: CoupleInfo
  weddingDate: string
  celebrations: CelebrationEvent[]
  blessing?: string
  heading?: string
  personalNote?: string
}

export interface RSVPFormData {
  name: string
  guestCount: number
  dietary: string
  attending: boolean | null
}
