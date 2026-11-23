// Muslim Couple Template — TypeScript Interfaces

export interface FamilyMember {
  name: string;
  relation: string;
  description?: string;
}

export interface FamilySide {
  role: 'son' | 'daughter';
  fatherName: string;
  motherName: string;
  invitationMessage: string;
}

export interface CelebrationEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl?: string;
  calendarUrl?: string;
}

export interface CoupleInfo {
  bride: string;
  groom: string;
  weddingDate: string;
  weddingTime: string;
  weddingDateFormatted: string;
  weddingTimeFormatted: string;
}

export interface ClosingInfo {
  duaArabic: string;
  duaEnglish: string;
  signoff: string;
  families: string;
}

export interface RSVPConfig {
  enabled: boolean;
  onSubmit?: (data: RSVPFormData) => void;
}

export interface RSVPFormData {
  name: string;
  guestCount: number;
  attending: boolean | null;
  message: string;
}

export interface TemplateData {
  couple: CoupleInfo;
  groomFamily: FamilySide;
  brideFamily: FamilySide;
  events: CelebrationEvent[];
  closing: ClosingInfo;
  rsvp: RSVPConfig;
  musicUrl?: string;
}
