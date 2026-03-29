import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [react(), tailwindcss()],
    define: {
      __APP_VERSION__: JSON.stringify(version),
    },
    base: './',
    server: {
      proxy: {
        '/api': {
          target: env.VITE_MEALIE_URL,
          changeOrigin: true,
          secure: false,
        },

      },
    },
  }
})
