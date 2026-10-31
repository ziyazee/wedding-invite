import sharp from 'sharp'
import { readdir, rename, stat } from 'fs/promises'
import { join } from 'path'

const DIR = 'public/templates/royal-grace'
const MAX_WIDTH = 1080

const targets = [
  { file: 'welcome.jpg', quality: 80 },
  { file: 'general.jpg', quality: 80 },
  { file: 'couple.png', quality: 80 },
  { file: 'end.png', quality: 80 },
  { file: 'celebration-roses.png', quality: 80 },
  { file: 'sage-stationery-unframed.png', quality: 80 },
  { file: 'ivory-stationery-unframed.png', quality: 80 },
  { file: 'opening-poster.jpg', quality: 80 },
]

for (const { file, quality } of targets) {
  const src = join(DIR, file)
  const ext = file.split('.').pop()
  const base = file.replace(/\.[^.]+$/, '')
  const outPath = join(DIR, `${base}.webp`)
  const backupPath = join(DIR, `${base}-original.${ext}`)

  try {
    const before = (await stat(src)).size
    const img = sharp(src)
    const meta = await img.metadata()

    let pipeline = img
    if (meta.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH)
    }

    await pipeline.webp({ quality, effort: 6 }).toFile(outPath)
    await rename(src, backupPath)

    const after = (await stat(outPath)).size
    const pct = ((1 - after / before) * 100).toFixed(1)
    console.log(`${file} → ${base}.webp  ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (${pct}% smaller)`)
  } catch (e) {
    console.error(`Failed: ${file}`, e.message)
  }
}
