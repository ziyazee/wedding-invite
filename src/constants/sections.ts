import type { SectionType } from '../types';

export const DEFAULT_SECTIONS_ORDER: SectionType[] = [
  'header',
  'coupleNames',
  'dateTime',
  'venue',
  'message',
  'footer',
];

export const SECTION_LABELS: Record<SectionType, string> = {
  header: 'Header / Banner',
  coupleNames: 'Couple Names',
  dateTime: 'Date & Time',
  venue: 'Venue',
  message: 'Message',
  footer: 'Footer',
};
