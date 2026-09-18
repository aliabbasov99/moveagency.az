import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: 'localized-preview',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const path = url.pathname.replace(/\/$/, '')
        if (/^\/(en|ru)(\/(mexfilik-siyaseti|istifade-sertleri))?$|^\/(mexfilik-siyaseti|istifade-sertleri)$/.test(path)) {
          req.url = `${path}/index.html${url.search}`
        }
        next()
      })
    },
  }],
})
