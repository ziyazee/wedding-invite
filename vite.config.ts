import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { applicationAPI } from './server/applications.ts'
import { invitationAPI } from './server/invitations.ts'
import { editsAPI } from './server/edits.ts'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        arjunbhavana: fileURLToPath(new URL('./arjunbhavana.html', import.meta.url)),
      },
    },
  },
  plugins: [
    {
      name: 'arjun-bhavana-share-page',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (/^\/design14(?:\/index\.html|\/)?(?:\?|$)/.test(req.url || '')) {
            res.writeHead(301, { Location: (req.url || '').replace(/^\/design14(?:\/index\.html|\/)?/, '/arjunbhavana') })
            res.end()
            return
          }
          if (/^\/arjunbhavana\/?(?:\?|$)/.test(req.url || '')) {
            req.url = (req.url || '').replace(/^\/arjunbhavana\/?/, '/arjunbhavana.html')
          }
          next()
        })
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (/^\/design14(?:\/index\.html|\/)?(?:\?|$)/.test(req.url || '')) {
            res.writeHead(301, { Location: (req.url || '').replace(/^\/design14(?:\/index\.html|\/)?/, '/arjunbhavana') })
            res.end()
            return
          }
          if (/^\/arjunbhavana\/?(?:\?|$)/.test(req.url || '')) {
            req.url = (req.url || '').replace(/^\/arjunbhavana\/?/, '/arjunbhavana.html')
          }
          next()
        })
      },
    },
    react(), tailwindcss(), invitationAPI(), applicationAPI(), editsAPI(),
  ],
})
