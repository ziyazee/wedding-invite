// Public audio paths are persisted in orders.form_data.music.
// Add new tracks here after placing their files in public/audios.
export const musicCategories = ['Muslim', 'Hindu', 'Christian', 'General'] as const
export type MusicCategory = typeof musicCategories[number]

// Generic filenames do not establish a religious category. Keep these under
// General until their content has been identified.
export const musicCatalog = [
  { label: 'Wedding Nasheed', src: '/audios/muslim/wedding-nasheed.mp3', category: 'Muslim' },
  { label: 'Music', src: '/audios/general/music.mp3', category: 'General' },
  { label: 'Template 02', src: '/audios/general/template02.mp3', category: 'General' },
  { label: 'Bisara', src: '/audios/general/bisara.mp3', category: 'General' },
  { label: 'Destination / Raabta / Qubool', src: '/audios/general/aamantran.mp3', category: 'General' },
  { label: 'Blossom and Oud', src: '/audios/general/blossom-and-oud.mp3', category: 'General' },
  { label: 'Autumn Wind', src: '/audios/general/autumn-wind.mp3', category: 'General' },
  { label: 'Majestic Intro', src: '/audios/general/majestic-intro.mp3', category: 'General' },
  { label: 'Bloom Wedding Music', src: '/audios/general/bloom-wedding.mp3', category: 'General' },
  { label: 'A Timeless Union — Track 1', src: '/audios/general/timeless-union-1.mp3', category: 'General' },
  { label: 'A Timeless Union — Track 2', src: '/audios/general/timeless-union-2.mp3', category: 'General' },
  { label: 'Royal Grace', src: '/audios/general/royal-grace.mp3', category: 'General' },
] as const

const legacyMusic: Record<string, string> = {
  '/audios/music.mp3': '/audios/general/music.mp3',
  '/audios/template02.mp3': '/audios/general/template02.mp3',
}
export const catalogMusicPath = (value: string) => legacyMusic[value] || value
export const isCatalogMusic = (value: string) => musicCatalog.some(track => track.src === catalogMusicPath(value))
export const musicLabel = (value: string) => musicCatalog.find(track => track.src === catalogMusicPath(value))?.label || (value ? 'Custom song' : 'Template default')
