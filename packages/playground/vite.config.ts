import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'

const root = fileURLToPath(import.meta.url)
const r = (p: string) => resolve(root, '..', p)

export default defineConfig({
  base: '/midjourney-sdk',
  plugins: [
    vue(),
    AutoImport({
      imports: ['vue', 'pinia', '@vueuse/core'],
      dirs: [r('src/stores')],
      dts: 'src/types/auto-import.d.ts'
    })
  ],
  define: {
    __DEV__: true
  },
  resolve: {
    alias: { '@': r('src') }
  }
})
