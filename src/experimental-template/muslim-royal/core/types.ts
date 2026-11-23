/* Muslim Royal — shared data types. Every section reads from WeddingData. */

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
  /** Native place (pind) shown beneath each family, e.g. "Pind Ghanaur, Patiala". */
  groomPlace?: string
  bridePlace?: string
}

export interface CelebrationEvent {
  id: string
  title: string
  /** YYYY-MM-DD */
  date: string
  /** Free text, e.g. "4:00 PM onwards" */
  time: string
  venue: string
  address: string
  /** Optional exact local start/end (YYYY-MM-DDTHH:mm). Falls back to parsing date + time. */
  startsAt?: string
  endsAt?: string
  /** Optional explicit map link. Falls back to a search on venue + address. */
  mapUrl?: string
  description?: string
}

export interface WeddingData {
  couple: CoupleInfo
  /** ISO local datetime of the main ceremony. Drives the countdown. */
  weddingDate: string
  celebrations: CelebrationEvent[]
  heading?: string
  blessing?: string
  personalNote?: string
}

export interface RSVPFormData {
  name: string
  guestCount: number
  dietary: string
  attending: boolean | null
}

/** Media accepted by any slot: an image or a video. */
export interface MediaSpec {
  type: 'image' | 'video'
  src: string
  /** Video poster, also the reduced-motion still. */
  poster?: string
  alt?: string
  /** CSS object-position, e.g. "50% 30%". */
  position?: string
  /**
   * 'background' fills behind the section content (default).
   * 'banner' renders as a framed strip above the section content.
   */
  slot?: 'background' | 'banner'
  /** Scrim strength over the media. Default 'soft'. */
  overlay?: 'none' | 'soft' | 'strong'
  /** Gentle scroll parallax (background and banner only). */
  parallax?: boolean
  /** CSS aspect-ratio for banners, e.g. "16 / 9". */
  aspect?: string
}
