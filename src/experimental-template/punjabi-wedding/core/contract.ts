/* Golden — the single plug-in contract.
   A section is a React component that receives { data, theme, ctx }.
   Everything else (particles, divider, media) hangs off the SectionPlugin. */

import type { ComponentType } from 'react'
import type { MediaSpec, RSVPFormData, WeddingData } from './types'
import type { Theme } from './theme'

/* ── Particles ── */

export type SpriteKind = 'sparkle' | 'petal' | 'leaf' | 'mote' | 'firefly' | 'ember' | 'gulab' | 'daisy'
export type MotionKind = 'twinkle' | 'float' | 'drift' | 'fall' | 'rise'
export type ParticleZone = 'full' | 'left' | 'right' | 'margins' | 'upper' | 'lower'

export interface ParticleSpec {
  sprite: SpriteKind
  motion: MotionKind
  count: number
  /** px, [min, max] */
  size: [number, number]
  opacity: [number, number]
  zone?: ParticleZone
  /** Theme colour token name, e.g. 'gold', 'goldBright', 'dawn'. */
  color?: string
}

/* ── Runtime context handed to every section ── */

export interface ScrollApi {
  stop: () => void
  start: () => void
  scrollTo: (target: string | number | HTMLElement) => void
}

export interface MusicApi {
  available: boolean
  playing: boolean
  start: () => void
  toggle: () => void
}

export interface SectionCtx {
  /** Section id from the registry. */
  id: string
  /** Position in the rendered page (opening is always 0). */
  index: number
  /** Page seed. Derive randomness from this, never Math.random(). */
  seed: number
  reducedMotion: boolean
  /** Media from this section's layout entry, if any. */
  media?: MediaSpec
  /** Free-form per-section options from the layout entry. */
  options: Record<string, unknown>
  scroll: ScrollApi
  music: MusicApi
  onRsvp?: (response: RSVPFormData) => void | Promise<void>
}

export interface SectionProps {
  data: WeddingData
  theme: Theme
  ctx: SectionCtx
}

/* ── Plug-in ── */

export interface SectionPlugin {
  id: string
  Component: ComponentType<SectionProps>
  /** Ambient particles this section brings. */
  particles?: ParticleSpec[]
  /** Divider rendered after the section. Same { data, theme, ctx } contract. */
  Divider?: ComponentType<SectionProps>
  /**
   * Who renders the section's media.
   * 'host' (default): the renderer draws it as background or banner.
   * 'self': the section reads ctx.media and places it itself (the Opening).
   * 'none': media is ignored.
   */
  media?: 'host' | 'self' | 'none'
}

/* ── Layout config ── */

export interface LayoutEntry {
  /** Registry id. */
  section: string
  /** Image or video for this section's media slot. */
  media?: MediaSpec
  options?: Record<string, unknown>
  /** false hides the section's own divider. */
  divider?: boolean
  /** false removes particles; an array replaces the section's defaults. */
  particles?: false | ParticleSpec[]
}

export interface MusicConfig {
  src: string
  /** Seconds to seek to when playback starts. */
  startAt?: number
  volume?: number
}

export interface GoldenConfig {
  /** Seeds every particle layout so renders are reproducible. */
  seed: number
  /** The Opening is always first and fixed. Not part of `layout`. */
  opening: {
    media: MediaSpec
    options?: Record<string, unknown>
  }
  /** Everything after the Opening, in order. */
  layout: LayoutEntry[]
  music?: MusicConfig
}
