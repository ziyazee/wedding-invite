import type { Plugin } from 'vite'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { randomUUID } from 'node:crypto'

const ALLOWED: Record<string, string[]> = {
  '.jpg': ['image/jpeg', 'image/jpg'],
  '.jpeg': ['image/jpeg', 'image/jpg'],
  '.png': ['image/png'],
  '.webp': ['image/webp'],
}

export function hallPhotoAPI(): Plugin {
  const directory = resolve(process.cwd(), 'public/uploads/hall-photos')

  return {
    name: 'hall-photo-upload-api',
    configureServer(server) {
      server.middlewares.use('/api/hall-photo', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        const send = (status: number, data: unknown) => {
          res.statusCode = status
          res.end(JSON.stringify(data))
        }

        if (req.method !== 'POST') { send(405, { error: 'POST required.' }); return }

        const contentType = (req.headers['content-type'] || '').split(';')[0].trim()
        const ext = Object.entries(ALLOWED).find(([, types]) => types.includes(contentType))?.[0]
        if (!ext) { send(400, { error: `Unsupported image type: ${contentType}` }); return }

        const maxBytes = 10_000_000
        const chunks: Buffer[] = []
        let total = 0
        try {
          for await (const chunk of req) {
            const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
            total += buf.length
            if (total > maxBytes) { send(413, { error: 'File too large (max 10 MB).' }); return }
            chunks.push(buf)
          }
        } catch {
          send(400, { error: 'Could not read upload.' })
          return
        }

        const filename = `${randomUUID()}${ext}`
        const dest = resolve(directory, filename)
        try {
          await mkdir(directory, { recursive: true })
          await writeFile(`${dest}.tmp`, Buffer.concat(chunks))
          await rename(`${dest}.tmp`, dest)
        } catch {
          send(500, { error: 'Could not save photo.' })
          return
        }

        send(200, { ok: true, path: `/uploads/hall-photos/${filename}` })
      })
    },
  }
}
