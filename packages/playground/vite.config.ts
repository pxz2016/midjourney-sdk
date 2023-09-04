import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import ElementPlus from 'unplugin-element-plus/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import Components from 'unplugin-vue-components/vite'

const root = fileURLToPath(import.meta.url)
const r = (p: string) => resolve(root, '..', p)

export default defineConfig({
  base: '/midjourney-sdk',
  plugins: [
    vue(),
    ElementPlus({}),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'pinia', '@vueuse/core'],
      dirs: [r('src/stores')],
      dts: 'src/types/auto-import.d.ts'
    }),
    Components({
      resolvers: [ElementPlusResolver()],
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
  }
})
