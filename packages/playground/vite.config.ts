import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { HeadlessUiResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Components from 'unplugin-vue-components/vite'

const root = fileURLToPath(import.meta.url)
const r = (p: string) => resolve(root, '..', p)

export default defineConfig({
  base: '/midjourney-sdk',
  plugins: [
    vue({ script: { defineModel: true } }),
    AutoImport({
      resolvers: [HeadlessUiResolver()],
      imports: [
        'vue',
        'pinia',
        '@vueuse/core',
        {
          '@/components/MjToast': [['handleToast', 'MjToast']]
        }
      ],
      dirs: [r('src/stores')],
      dts: 'src/types/auto-import.d.ts'
    }),
    Components({
      resolvers: [HeadlessUiResolver()],
      dts: 'src/types/components.d.ts'
    }),
    createSvgIconsPlugin({
      iconDirs: [r('src/icons')]
    })
  ],
  define: {
    __DEV__: true
  },
  resolve: {
    alias: { '@': r('src') }
  },
  server: {
    proxy: {
      '/inpaint': {
        target: 'https://936929561302675456.discordsays.com',
        changeOrigin: true
      }
    }
  }
})
