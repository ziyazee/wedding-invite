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
      name: 'invitation-initial-tint',
      transformIndexHtml() {
        const tintVariables = Object.entries(INVITATION_VIEWPORT_THEMES).map(([id, theme]) => {
          const [red, green, blue] = [1, 3, 5].map(start => Number.parseInt(theme.backgroundColor.slice(start, start + 2), 16))
          const ink = .2126 * red + .7152 * green + .0722 * blue < 128 ? '#f7efe3' : '#302a22'
          return `html[data-invitation-tint="${id}"]:not([data-invitation-theme]), html[data-invitation-theme="${id}"] {
            --invitation-tint-color: ${theme.backgroundColor};
            --invitation-tint-ink: ${ink};
            --invitation-tint-muted: ${ink}26;
          }`
        }).join('\n')
        // Safari can retain the initial page tint. This must be a synchronous
        // head script, before the cream fallback or deferred React code paints.
        return [
          {
            tag: 'script', injectTo: 'head',
            children: `(() => {
              const themes = ${JSON.stringify(INVITATION_VIEWPORT_THEMES)};
              const path = location.pathname.replace(/\\/+$/, '');
              const entry = Object.entries(themes).find(([, theme]) => theme.routes.includes(path));
              if (!entry) return;
              const [id, theme] = entry;
              document.documentElement.dataset.invitationTint = id;
              document.documentElement.style.setProperty('--invitation-surround-color', theme.backgroundColor);
              const themeColor = document.querySelector('meta[name="theme-color"]') || document.createElement('meta');
              themeColor.name = 'theme-color';
              themeColor.content = theme.backgroundColor;
              if (!themeColor.isConnected) document.head.append(themeColor);
              // Preserve Tajmahal's existing bootstrap behavior exactly.
              // Tint rollout must not change viewport settings for other templates.
              if (id === '17') {
                document.documentElement.dataset.invitationTheme = '17';
                const viewportFit = /CriOS\\//.test(navigator.userAgent) ? 'contain' : 'cover';
                document.querySelector('meta[name="viewport"]').content += ', viewport-fit=' + viewportFit;
              }
            })();`,
          },
          {
            tag: 'style', injectTo: 'head',
            children: `html[data-invitation-theme="17"], html[data-invitation-theme="17"] body,
              html[data-invitation-theme="17"] #app-splash {
                background: var(--invitation-surround-color) !important;
                color: #f7efe3 !important;
              }`,
          },
          {
            tag: 'style', injectTo: 'head',
            children: `${tintVariables}
              html:is([data-invitation-tint], [data-invitation-theme]),
              html:is([data-invitation-tint], [data-invitation-theme]) body {
                background-color: var(--invitation-tint-color, var(--invitation-surround-color)) !important;
              }
              html:is([data-invitation-tint], [data-invitation-theme]) #app-splash,
              html:is([data-invitation-tint], [data-invitation-theme]) .invitation-loading {
                background: var(--invitation-tint-color, var(--invitation-surround-color)) !important;
                color: var(--invitation-tint-ink, #635642) !important;
              }
              html:is([data-invitation-tint], [data-invitation-theme]) .invitation-loading-indicator {
                border-color: var(--invitation-tint-muted, #63564226);
                border-top-color: var(--invitation-tint-ink, #635642);
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
