// Built-in fallback and allowlist for legacy local paths in orders.form_data.music.
// New songs are uploaded through Admin > Music and loaded from music_tracks.
export const musicCategories = ['Classic', 'Hindu', 'Muslim'] as const
export type MusicCategory = typeof musicCategories[number]

// Classic is the neutral category. Generic filenames do not establish a
// religious category; existing /audios/general paths stay unchanged.
export const musicCatalog = [
  { label: 'Wedding Nasheed', src: '/audios/muslim/wedding-nasheed.mp3', category: 'Muslim' },
  { label: 'Music', src: '/audios/general/music.mp3', category: 'Classic' },
  { label: 'Template 02', src: '/audios/general/template02.mp3', category: 'Classic' },
  { label: 'Bisara', src: '/audios/general/bisara.mp3', category: 'Classic' },
  { label: 'Destination / Raabta / Qubool', src: '/audios/general/aamantran.mp3', category: 'Classic' },
  { label: 'Blossom and Oud', src: '/audios/general/blossom-and-oud.mp3', category: 'Classic' },
  { label: 'Autumn Wind', src: '/audios/general/autumn-wind.mp3', category: 'Classic' },
  { label: 'Majestic Intro', src: '/audios/general/majestic-intro.mp3', category: 'Classic' },
  { label: 'Bloom Wedding Music', src: '/audios/general/bloom-wedding.mp3', category: 'Classic' },
  { label: 'A Timeless Union — Track 1', src: '/audios/general/timeless-union-1.mp3', category: 'Classic' },
  { label: 'A Timeless Union — Track 2', src: '/audios/general/timeless-union-2.mp3', category: 'Classic' },
  { label: 'Royal Grace', src: '/audios/general/royal-grace.mp3', category: 'Classic' },
] as const

export function musicCategoryForDesign(category: string): MusicCategory {
  if (/\bmuslim\b/i.test(category)) return 'Muslim'
  if (/\bhindu\b/i.test(category)) return 'Hindu'
  return 'Classic'
}

const legacyMusic: Record<string, string> = {
  '/audios/music.mp3': '/audios/general/music.mp3',
  '/audios/template02.mp3': '/audios/general/template02.mp3',
}
export const catalogMusicPath = (value: string) => legacyMusic[value] || value
export const isCatalogMusic = (value: string) => musicCatalog.some(track => track.src === catalogMusicPath(value))
export const musicLabel = (value: string) => musicCatalog.find(track => track.src === catalogMusicPath(value))?.label || (value ? 'Custom song' : 'Template default')
