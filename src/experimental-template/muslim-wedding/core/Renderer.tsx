/* Golden — the generic renderer. Reads the config, looks each section up in the registry,
   and renders: [media] [particles] [section] [divider]. No section-specific code lives here. */

import { useEffect, useMemo } from 'react'
import { ScrollTrigger } from './gsap'
import { getSection } from './registry'
import { theme as defaultTheme } from './theme'
import type { Theme } from './theme'
import type {
  GoldenConfig,
  LayoutEntry,
  ParticleSpec,
  SectionCtx,
  ScrollApi,
  MusicApi,
  SectionPlugin,
} from './contract'
import type { RSVPFormData, WeddingData } from './types'
import { hashSeed } from './seed'
import { useReducedMotion } from './useReducedMotion'
import { useScroll } from './useScroll'
import { useMusic } from './useMusic'
import ThemeRoot from './ThemeRoot'
import MediaSlot from './MediaSlot'
import MusicButton from './MusicButton'
import AmbientLayer from './ambient/AmbientLayer'

interface RendererProps {
  config: GoldenConfig
  data: WeddingData
  theme?: Theme
  onRsvp?: (response: RSVPFormData) => void | Promise<void>
}

/** The Opening is always first and fixed; stray 'opening' entries in layout are dropped. */
function resolveEntries(config: GoldenConfig): LayoutEntry[] {
  const opening: LayoutEntry = {
    section: 'opening',
    media: config.opening.media,
    options: config.opening.options,
  }
  const rest = config.layout.filter((e) => {
    if (e.section === 'opening') {
      if (import.meta.env.DEV) console.warn('[golden] "opening" in layout is ignored; it is fixed first.')
      return false
    }
    return true
  })
  return [opening, ...rest]
}

interface HostProps {
  entry: LayoutEntry
  plugin: SectionPlugin
  index: number
  data: WeddingData
  theme: Theme
  seed: number
  reducedMotion: boolean
  scroll: ScrollApi
  music: MusicApi
  onRsvp?: RendererProps['onRsvp']
}

function SectionHost({ entry, plugin, index, data, theme, seed, reducedMotion, scroll, music, onRsvp }: HostProps) {
  const sectionSeed = hashSeed(seed, plugin.id, index)
  const ctx: SectionCtx = {
    id: plugin.id,
    index,
    seed: sectionSeed,
    reducedMotion,
    media: entry.media,
    options: entry.options ?? {},
    scroll,
    music,
    onRsvp,
  }

  const props = { data, theme, ctx }
  const { Component, Divider } = plugin
  const particles: ParticleSpec[] =
    entry.particles === false ? [] : (entry.particles ?? plugin.particles ?? [])

  const hostMedia = entry.media && (plugin.media ?? 'host') === 'host' ? entry.media : undefined
  const slot = hostMedia?.slot ?? 'background'

  return (
    <>
      <div className={`mw-host${hostMedia ? ' has-media' : ''}`} data-section={plugin.id}>
        {hostMedia && slot === 'background' ? (
          <MediaSlot media={hostMedia} reducedMotion={reducedMotion} />
        ) : null}
        <AmbientLayer particles={particles} seed={sectionSeed} reducedMotion={reducedMotion} theme={theme} />
        {hostMedia && slot === 'banner' ? (
          <div className="mw-host__banner">
            <MediaSlot media={hostMedia} reducedMotion={reducedMotion} />
          </div>
        ) : null}
        <Component {...props} />
      </div>
      {Divider && entry.divider !== false ? <Divider {...props} /> : null}
    </>
  )
}

export default function GoldenRenderer({ config, data, theme = defaultTheme, onRsvp }: RendererProps) {
  const reducedMotion = useReducedMotion()
  const scroll = useScroll(reducedMotion)
  const { api: music, audioProps } = useMusic(config.music)
  const entries = useMemo(() => resolveEntries(config), [config])

  // Re-measure triggers once webfonts have settled.
  useEffect(() => {
    void document.fonts.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <ThemeRoot theme={theme}>
      {config.music ? <audio {...audioProps} /> : null}
      <MusicButton music={music} />
      {entries.map((entry, index) => {
        const plugin = getSection(entry.section)
        if (!plugin) {
          if (import.meta.env.DEV) console.warn(`[golden] unknown section "${entry.section}"`)
          return null
        }
        return (
          <SectionHost
            key={`${entry.section}-${index}`}
            entry={entry}
            plugin={plugin}
            index={index}
            data={data}
            theme={theme}
            seed={config.seed}
            reducedMotion={reducedMotion}
            scroll={scroll}
            music={music}
            onRsvp={onRsvp}
          />
        )
      })}
    </ThemeRoot>
  )
}
