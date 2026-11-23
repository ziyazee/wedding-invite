export interface CoupleInfo {
  groomName: string;
  brideName: string;
  groomFamily: string;
  brideFamily: string;
  groomFatherName?: string;
  groomMotherName?: string;
  brideFatherName?: string;
  brideMotherName?: string;
}

export interface CelebrationEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description?: string;
  dressCode?: string;
}

export interface RSVPEntry {
  name: string;
  attending: boolean;
  guestCount: number;
  message?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface WeddingData {
  couple: CoupleInfo;
  weddingDate: string;
  celebrations: CelebrationEvent[];
  tagline?: string;
  blessing?: string;
  personalNote?: string;
}
