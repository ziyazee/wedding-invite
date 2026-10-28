import type { Plugin } from 'vite'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { readTextLayout } from '../src/invitations/textLayout.ts'
import type { TextLayout } from '../src/invitations/textLayout.ts'

export function editsAPI(): Plugin {
  const directory = resolve(process.cwd(), 'public/edits')
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

        const match = (req.url || '/').split('?')[0].match(/^\/(\d+)$/)
        const templateId = match ? Number(match[1]) : NaN
        if (req.method !== 'POST' || !Number.isInteger(templateId) || templateId < 1 || templateId > 14) {
          send(405, { error: 'A valid template ID and POST request are required.' })
          return
        }
        if (req.headers.origin && req.headers.origin !== `http://${req.headers.host}` && req.headers.origin !== `https://${req.headers.host}`) {
          send(403, { error: 'Invalid origin.' })
          return
        }

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
