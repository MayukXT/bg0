import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

// The docs are a separate Blume app (apps/docs) served under /docs. Pages go
// through the `/docs/$` server route; this Vite proxy catches the asset and
// dev-module requests that Vite's own middleware would otherwise answer.
const docsOrigin = process.env.BG0_DOCS_ORIGIN ?? 'http://127.0.0.1:4321'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), nitro(), tailwindcss(), tanstackStart(), viteReact()],
  server: {
    proxy: {
      '/docs': { target: docsOrigin, changeOrigin: true, ws: true },
    },
  },
})

export default config
