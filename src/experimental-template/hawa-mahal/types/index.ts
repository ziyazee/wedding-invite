// Hawa Mahal — Type definitions

export interface FamilyMember {
  name: string;
  description: string;
}

export interface FamilySide {
  label: string;
  members: FamilyMember[];
}

export interface HmEvent {
  id: string;
  type: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  address: string[];
  mapUrl?: string;
}

export interface RSVPResponse {
  guestName: string;
  attending: boolean | null;
  message: string;
}

export interface InvitationData {
  groomName: string;
  brideName: string;
  welcomeLabel: string;
  welcomeMessage: string;
  weddingDate: Date;
  weddingDateDisplay: string;
  weddingDay: string;
  weddingTime: string;
  groomFamily: FamilySide;
  brideFamily: FamilySide;
  events: HmEvent[];
  rsvpMessage: string;
  closingMessage: string;
  hashtag: string;
}
