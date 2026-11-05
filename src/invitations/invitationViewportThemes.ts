export type InvitationViewportTheme = {
  backgroundColor: string
  routes: readonly string[]
  artwork?: { src: string; opacity?: number }
}

// Shared by the HTML bootstrap and runtime theme application. Keep this
// module free of browser APIs so Vite can also read the palette at build time.
export const INVITATION_VIEWPORT_THEMES: Readonly<Record<number, InvitationViewportTheme>> = {
  1: { backgroundColor: '#D6C5AC', routes: ['/royal-grace'] },
  2: { backgroundColor: '#ECE8D9', routes: ['/majestic'] },
  3: { backgroundColor: '#F8F2E9', routes: ['/a-timeless-union', '/arjunbhavana'] },
  4: { backgroundColor: '#D19B72', routes: ['/mandap-at-dusk'] },
  5: { backgroundColor: '#EFE8DA', routes: ['/secret-garden'] },
  6: { backgroundColor: '#F5F0E8', routes: ['/embroidered-garden'] },
  7: {
    backgroundColor: '#F8F1E8', routes: ['/bloom'],
    artwork: { src: '/templates/bloom/assets/intro-video-2-poster.jpg', opacity: .1 },
  },
  8: { backgroundColor: '#FBF5ED', routes: ['/the-artful-love-story'] },
  9: { backgroundColor: '#31090E', routes: ['/maroon-letter'] },
  10: { backgroundColor: '#0F1E16', routes: ['/emerald-parchment'] },
  11: { backgroundColor: '#0D1B3E', routes: ['/royal-jodhpur'] },
  12: { backgroundColor: '#1A3A2A', routes: ['/destination-wedding'] },
  13: { backgroundColor: '#1B2838', routes: ['/raabta'] },
  14: { backgroundColor: '#0E1F1D', routes: ['/qubool'] },
  15: { backgroundColor: '#1A0A0A', routes: ['/mangal'] },
  16: { backgroundColor: '#1A0510', routes: ['/viah'] },
  17: { backgroundColor: '#101A30', routes: ['/tajmahal'] },
}
