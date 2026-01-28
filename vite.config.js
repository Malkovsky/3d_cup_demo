import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/3d_cup_demo/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})
