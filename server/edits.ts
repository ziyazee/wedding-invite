import type { Plugin } from 'vite'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { readTextLayout } from '../src/invitations/textLayout.ts'
import type { TextLayout } from '../src/invitations/textLayout.ts'

const TEMPLATE_FOLDERS: Record<number, string> = {
  1: 'royal-grace',
  2: 'majestic',
  3: 'a-timeless-union',
  4: 'mandap-at-dusk',
  5: 'secret-garden',
  6: 'embroidered-garden',
  7: 'bloom',
  8: 'the-artful-love-story',
  9: 'maroon-letter',
  10: 'emerald-parchment',
  11: 'shaadipath-t02',
  12: 'destination-wedding',
  13: 'raabta',
  14: 'qubool',
}

const TEMPLATE_IMAGE_SLOTS: Record<number, string[]> = {
  1: ['welcome.jpg', 'general.jpg', 'end.png', 'opening-poster.jpg', 'opening.mp4'],
}

const ALLOWED_CONTENT_TYPES: Record<string, string[]> = {
  '.jpg': ['image/jpeg', 'image/jpg'],
  '.png': ['image/png'],
  '.webp': ['image/webp'],
  '.mp4': ['video/mp4'],
}

export function editsAPI(): Plugin {
  const directory = resolve(process.cwd(), 'public/edits')
  const templatesDir = resolve(process.cwd(), 'public/templates')
  let queue: Promise<unknown> = Promise.resolve()

  return {
    name: 'local-template-edits-api',
    configureServer(server) {
      server.middlewares.use('/api/edits', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        const send = (status: number, data: unknown) => {
          res.statusCode = status
          res.end(JSON.stringify(data))
        }

        const checkOrigin = () => {
          if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}` && req.headers.origin !== `https://${req.headers.host}`) {
            send(403, { error: 'Invalid origin.' })
            return false
          }
          return true
        }

        const url = (req.url || '/').split('?')[0]

        // Image upload: POST /api/edits/image/{templateId}/{filename}
        const imageMatch = url.match(/^\/image\/(\d+)\/([a-z0-9_.-]+)$/)
        if (imageMatch) {
          const templateId = Number(imageMatch[1])
          const filename = imageMatch[2]
          const folder = TEMPLATE_FOLDERS[templateId]
          const allowedSlots = TEMPLATE_IMAGE_SLOTS[templateId] || []
          if (req.method !== 'POST' || !folder || !allowedSlots.includes(filename)) {
            send(405, { error: 'Invalid template, slot, or method.' })
            return
          }
          if (!checkOrigin()) return
          const ext = extname(filename).toLowerCase()
          const allowed = ALLOWED_CONTENT_TYPES[ext] || []
          const contentType = (req.headers['content-type'] || '').split(';')[0].trim()
          if (!allowed.includes(contentType)) {
            send(400, { error: `Unexpected content type ${contentType} for ${filename}.` })
            return
          }
          const maxBytes = ext === '.mp4' ? 100_000_000 : 20_000_000
          const chunks: Buffer[] = []
          let total = 0
          try {
            for await (const chunk of req) {
              const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
              total += buf.length
              if (total > maxBytes) { send(413, { error: 'File too large.' }); return }
              chunks.push(buf)
            }
          } catch {
            send(400, { error: 'Could not read upload.' })
            return
          }
          const dest = resolve(templatesDir, folder, filename)
          const tmp = `${dest}.tmp`
          try {
            await writeFile(tmp, Buffer.concat(chunks))
            await rename(tmp, dest)
          } catch {
            send(500, { error: 'Could not save image.' })
            return
          }
          send(200, { ok: true, path: `/templates/${folder}/${filename}` })
          return
        }

        const match = url.match(/^\/(\d+)$/)
        const templateId = match ? Number(match[1]) : NaN
        if (req.method !== 'POST' || !Number.isInteger(templateId) || templateId < 1 || templateId > 14) {
          send(405, { error: 'A valid template ID and POST request are required.' })
          return
        }
        if (!checkOrigin()) return

        let incoming: TextLayout
        try {
          let body = ''
          for await (const chunk of req) {
            body += chunk.toString()
            if (body.length > 100_000) {
              send(413, { error: 'Template edits are too large.' })
              return
            }
          }
          incoming = readTextLayout(JSON.parse(body))
        } catch {
          send(400, { error: 'Invalid template edit data.' })
          return
        }

        const task = queue.then(async () => {
          const file = resolve(directory, `${templateId}.json`)
          let existing = readTextLayout(undefined)
          try {
            existing = readTextLayout(JSON.parse(await readFile(file, 'utf8')))
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
          }
          const elements = { ...existing.elements }
          for (const [id, value] of Object.entries(incoming.elements)) {
            elements[id] = { ...elements[id], ...value }
          }
          const layout = readTextLayout({ version: 1, elements })
          await mkdir(directory, { recursive: true })
          await writeFile(`${file}.tmp`, JSON.stringify(layout, null, 2))
          await rename(`${file}.tmp`, file)
          return layout
        })
        queue = task.catch(() => {})

        try {
          send(200, { layout: await task })
        } catch {
          send(500, { error: 'Could not update the template edits file.' })
        }
      })
    },
  }
}
