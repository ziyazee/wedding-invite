import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { applicationAPI } from './server/applications.ts'
import { invitationAPI } from './server/invitations.ts'

export default defineConfig({
  plugins: [
    {
      name: 'arjun-bhavana-share-page',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (/^\/design14\/?(?:\?|$)/.test(req.url || '')) {
            res.writeHead(301, { Location: (req.url || '').replace(/^\/design14\/?/, '/arjunbhavana') })
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
          if (/^\/design14\/?(?:\?|$)/.test(req.url || '')) {
            res.writeHead(301, { Location: (req.url || '').replace(/^\/design14\/?/, '/arjunbhavana') })
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
    react(), tailwindcss(), invitationAPI(), applicationAPI(),
  ],
})
