import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr({
    svgrOptions: {
      icon: true,
      iconSelector: 'svg',
      titleProp: true,
      nativeRequire: false,
    },
    include: ['**/*.svg'],
    compiler: 'svgr',
  })],
  base: './',
  build: {
    outDir: 'build'
  },
  server: {
    port: 3000
  },
  resolve: {
    alias: {
      '@': '/src'
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
      generateScopedName: 'data-[locals][hash:base64]'
    }
  }
})
