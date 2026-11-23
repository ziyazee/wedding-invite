// Scroll the journey and capture each scene at several progress points.
// Usage: node qa-journey.mjs [--reduced] [--out /tmp/pj-shots]
import { chromium } from 'playwright'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
const args = process.argv.slice(2)
const reduced = args.includes('--reduced')
const out = args.includes('--out') ? args[args.indexOf('--out') + 1] : '/tmp/pj-shots'
fs.mkdirSync(out, { recursive: true })
const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright')
const dir = fs.readdirSync(cache).find((d) => d.startsWith('chromium_headless_shell'))
const sub = fs.readdirSync(path.join(cache, dir)).find((d) => d.startsWith('chrome-headless-shell') && d.includes(process.arch === 'arm64' ? 'arm64' : 'x64'))
const browser = await chromium.launch({ executablePath: path.join(cache, dir, sub, 'chrome-headless-shell') })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: reduced ? 'reduce' : 'no-preference' })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto('http://127.0.0.1:5199/experimental/punjabi-journey', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const frame = page.frames()[1] ?? page.mainFrame()
const shot = async (f) => { const h = await page.$('iframe'); await (h ? h.screenshot({ path: f }) : page.screenshot({ path: f })) }
const info = await frame.evaluate(() => {
  const vh = innerHeight
  return {
    vh,
    total: document.documentElement.scrollHeight,
    scenes: [...document.querySelectorAll('[data-scene]')].map((t) => ({ id: t.dataset.scene, top: Math.round(t.getBoundingClientRect().top + scrollY), h: t.offsetHeight })),
  }
})
const points = [0, 0.2, 0.45, 0.7, 0.95]
for (const s of info.scenes) {
  for (const f of points) {
    const y = Math.round(s.top + (s.h - info.vh) * f)
    await frame.evaluate((yy) => scrollTo(0, yy), y)
    await page.waitForTimeout(reduced ? 250 : 800)
    await shot(`${out}/${reduced ? 'rm' : 'm'}-${s.id}-${String(Math.round(f * 100)).padStart(3, '0')}.png`)
  }
}
const overflow = await frame.evaluate(() => document.documentElement.scrollWidth > innerWidth)
console.log(JSON.stringify({ ...info, overflow, errors }))
await browser.close()
