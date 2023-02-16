import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://alicornlunaa.github.io/digital_portfolio",
  plugins: [react()],
  build: {
    outDir: "./build"
  }
})
