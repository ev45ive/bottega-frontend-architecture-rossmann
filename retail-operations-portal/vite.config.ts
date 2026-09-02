import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@/modules': path.resolve(import.meta.dirname, './packages'),
      '@': path.resolve(import.meta.dirname, './src'),
      '@ross-org/product-catalog': path.resolve(import.meta.dirname, './packages/product-catalog/index.ts'),
      '@ross-org/product-pricing': path.resolve(import.meta.dirname, './packages/product-pricing/index.ts'),
      '@ross-org/sales-fulfilment': path.resolve(import.meta.dirname, './packages/sales-fulfilment/index.ts'),
      '@ross-org/platform': path.resolve(import.meta.dirname, './packages/platform/index.ts'),
    },
  },
})
