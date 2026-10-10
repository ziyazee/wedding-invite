import type { TemplateId } from '../types';

export interface TemplateMeta {
  id: TemplateId;
  name: string;
  description: string;
  previewColors: { bg: string; accent: string; text: string };
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: 'classic-elegant',
    name: 'Classic Elegant',
    description: 'Serif fonts, gold accents, and ornamental borders for a timeless feel.',
    previewColors: { bg: '#fdf8f0', accent: '#c9a84c', text: '#1a1a2e' },
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean lines, generous whitespace, and a monochrome palette.',
    previewColors: { bg: '#ffffff', accent: '#555555', text: '#111111' },
  },
  {
    id: 'floral-garden',
    name: 'Floral Garden',
    description: 'Soft pastels, script fonts, and watercolor floral touches.',
    previewColors: { bg: '#fef9f5', accent: '#d4a0a0', text: '#2d5016' },
  },
  {
    id: 'sacred-garden',
    name: 'The Sacred Garden',
    description: 'Luxury Islamic-themed design with deep greens, gold accents, and elegant rose motifs.',
    previewColors: { bg: '#0a2e1a', accent: '#c9a84c', text: '#f5f0e8' },
  },
];
