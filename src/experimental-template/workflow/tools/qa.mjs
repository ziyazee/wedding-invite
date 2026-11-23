// QA screenshots for an experimental template at 390px, through the 9:16 iframe frame.
// Usage (from repo root, needs the dev server running and UNSANDBOXED shell for Chromium):
//   node src/experimental-template/workflow/tools/qa.mjs <name> [prefix] [--reduced] [--port 5199] [--out /tmp/shots]
// Reports: console errors, horizontal overflow, scroll height. Screenshots: opening before/after tap,
// then one per ~640px of scroll. Look at them; the script cannot judge collisions for you.
import { chromium } from 'playwright'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const args = process.argv.slice(2)
const flag = (n, d) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : d }
const pos = args.filter((a, i) => !a.startsWith('--') && !(i && args[i - 1].startsWith('--') && args[i - 1] !== '--reduced'))
const [name, prefix = 'gd'] = pos
if (!name) { console.error('usage: qa.mjs <name> [prefix] [--reduced]'); process.exit(1) }
const reduced = args.includes('--reduced')
const port = flag('--port', '5199')
const out = flag('--out', '/tmp/shots')
const tag = reduced ? 'rm' : 'm'
fs.mkdirSync(out, { recursive: true })

// The Cursor shell sets PLAYWRIGHT_BROWSERS_PATH to a sandbox cache and Node may run under Rosetta
// (x64), so resolve the installed headless shell explicitly from the user cache.
const cache = path.join(os.homedir(), 'Library/Caches/ms-playwright')
let executablePath
if (fs.existsSync(cache)) {
  const dir = fs.readdirSync(cache).find((d) => d.startsWith('chromium_headless_shell'))
  if (dir) {
    const subs = fs.readdirSync(path.join(cache, dir)).filter((d) => d.startsWith('chrome-headless-shell'))
    const want = process.arch === 'arm64' ? 'arm64' : 'x64'
    const sub = subs.find((d) => d.includes(want)) ?? subs[0]
    const exe = sub && path.join(cache, dir, sub, 'chrome-headless-shell')
    if (exe && fs.existsSync(exe)) executablePath = exe
  }
}

const browser = await chromium.launch(executablePath ? { executablePath } : {})
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: reduced ? 'reduce' : 'no-preference',
})
const page = await ctx.newPage()
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto(`http://localhost:${port}/experimental/${name}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const frame = page.frames()[1] ?? page.mainFrame()
const shot = async (file) => (await page.$('iframe'))?.screenshot({ path: file }) ?? page.screenshot({ path: file })

await shot(`${out}/${tag}-00-opening-pre.png`)
const cta = await frame.$(`.${prefix}-opening__cta`)
if (cta) { await cta.click(); await page.waitForTimeout(500) }
await page.waitForTimeout(reduced ? 500 : 4500)
await shot(`${out}/${tag}-01-opening-post.png`)

const h = await frame.evaluate(() => document.documentElement.scrollHeight)
let i = 2
for (let y = 700; y < h; y += 640) {
  await frame.evaluate((yy) => window.scrollTo(0, yy), y)
  await page.waitForTimeout(reduced ? 300 : 1800)
  await shot(`${out}/${tag}-${String(i++).padStart(2, '0')}-y${y}.png`)
}
const overflow = await frame.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
console.log(JSON.stringify({ height: h, shots: i, horizontalOverflow: overflow, consoleErrors: errors.slice(0, 8), out }))
await browser.close()
