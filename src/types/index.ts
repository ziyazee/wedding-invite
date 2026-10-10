export type SectionType =
  | 'header'
  | 'coupleNames'
  | 'dateTime'
  | 'venue'
  | 'message'
  | 'footer';

export type TemplateId = 'classic-elegant' | 'modern-minimal' | 'floral-garden' | 'sacred-garden';

export interface TimelineEvent {
  name: string;
  time: string;
}

export interface WeddingDetails {
  groomName: string;
  brideName: string;
  weddingDate: string;
  venueName: string;
  venueAddress: string;
  ceremonyTime: string;
  receptionTime: string;
  optionalMessage?: string;
  timelineEvents?: TimelineEvent[];
  dressCode?: string;
  giftNote?: string;
  tagline?: string;
}

export interface RsvpEntry {
  id: string;
  guestName: string;
  attending: 'yes' | 'no';
  numberOfGuests: number;
  songPreference?: string;
  childrenDetails?: string;
  submittedAt: string;
}

export interface Invitation {
  id: string;
  slug: string;
  event_type: 'wedding';
  template_id: TemplateId;
  sections_order: SectionType[];
  details: WeddingDetails;
  created_at: string;
  updated_at: string;
}

export interface TemplateProps {
  details: WeddingDetails;
  sectionsOrder: SectionType[];
  slug?: string;
  showSplash?: boolean;
  previewMode?: boolean;
}

export interface CreateFlowState {
  currentStep: number;
  eventType: 'wedding' | null;
  details: Partial<WeddingDetails>;
  templateId: TemplateId | null;
  sectionsOrder: SectionType[];
}
