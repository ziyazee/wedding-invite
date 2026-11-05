import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import { applicationAPI } from './server/applications.ts'
import { invitationAPI } from './server/invitations.ts'
import { editsAPI } from './server/edits.ts'
import { INVITATION_VIEWPORT_THEMES } from './src/invitations/invitationViewportThemes.ts'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        arjunbhavana: fileURLToPath(new URL('./arjunbhavana.html', import.meta.url)),
        majestic: fileURLToPath(new URL('./majestic.html', import.meta.url)),
      },
    },
  },
  plugins: [
    {
      name: 'tajmahal-initial-theme',
      transformIndexHtml() {
        const theme = INVITATION_VIEWPORT_THEMES[17]
        // Safari can retain the initial page tint. This must be a synchronous
        // head script, before the cream fallback or deferred React code paints.
        return [
          {
            tag: 'script', injectTo: 'head',
            children: `if (${JSON.stringify(theme.routes)}.includes(location.pathname.replace(/\\/+$/, ''))) {
              document.documentElement.dataset.invitationTheme = '17';
              document.documentElement.style.setProperty('--invitation-surround-color', ${JSON.stringify(theme.backgroundColor)});
              document.querySelector('meta[name="viewport"]').content += ', viewport-fit=cover';
            }`,
          },
          {
            tag: 'style', injectTo: 'head',
            children: `html[data-invitation-theme="17"], html[data-invitation-theme="17"] body,
              html[data-invitation-theme="17"] #app-splash {
                background: var(--invitation-surround-color) !important;
                color: #f7efe3 !important;
              }`,
          },
        ]
      },
    },
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
          if (/^\/majestic\/?(?:\?|$)/.test(req.url || '')) {
            req.url = (req.url || '').replace(/^\/majestic\/?/, '/majestic.html')
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
          if (/^\/majestic\/?(?:\?|$)/.test(req.url || '')) {
            req.url = (req.url || '').replace(/^\/majestic\/?/, '/majestic.html')
          }
          next()
        })
      },
    },
    react(), tailwindcss(), invitationAPI(), applicationAPI(), editsAPI(),
  ],
})
