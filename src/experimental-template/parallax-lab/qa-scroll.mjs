import { chromium } from 'playwright'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
const out = '/tmp/pl-shots'; fs.mkdirSync(out, { recursive: true })
const reduced = process.argv.includes('--reduced')
const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright')
const dir = fs.readdirSync(cache).find((d) => d.startsWith('chromium_headless_shell'))
const sub = fs.readdirSync(path.join(cache, dir)).find((d) => d.startsWith('chrome-headless-shell') && d.includes(process.arch === 'arm64' ? 'arm64' : 'x64'))
const executablePath = path.join(cache, dir, sub, 'chrome-headless-shell')
const browser = await chromium.launch({ executablePath })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, reducedMotion: reduced ? 'reduce' : 'no-preference' })
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto('http://127.0.0.1:5199/experimental/parallax-lab', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
const frame = page.frames()[1] ?? page.mainFrame()
const shot = (f) => (page.$('iframe').then((h) => h ? h.screenshot({ path: f }) : page.screenshot({ path: f })))
const vh = await frame.evaluate(() => innerHeight)
const total = await frame.evaluate(() => document.documentElement.scrollHeight - innerHeight)
const track = vh * 3.4 - vh
for (const f of [0, 0.15, 0.35, 0.55, 0.75, 1]) {
  await frame.evaluate((y) => scrollTo(0, y), Math.round(track * f))
  await page.waitForTimeout(900)
  await shot(`${out}/${reduced ? 'rm' : 'm'}-${String(Math.round(f * 100)).padStart(3, '0')}.png`)
}
await frame.evaluate((y) => scrollTo(0, y), total)
await page.waitForTimeout(600)
await shot(`${out}/${reduced ? 'rm' : 'm'}-end.png`)
const overflow = await frame.evaluate(() => document.documentElement.scrollWidth > innerWidth)
console.log(JSON.stringify({ total, overflow, errors }))
await browser.close()
