import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  build: {
    target: 'esnext', // this allows top-level await
  },
  plugins: [
    tailwindcss(),
  ],
})