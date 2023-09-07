import { defineConfig } from 'rollup'
import path from 'path'
import { fileURLToPath } from 'url'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import { builtinModules, createRequire } from 'module'

const require = createRequire(import.meta.url)
const __dirname = fileURLToPath(new URL('.', import.meta.url))

const packagesDir = path.resolve(__dirname, 'packages')
const packageDir = path.resolve(packagesDir, 'midjourney-sdk')

const resolve = (p) => path.resolve(packageDir, p)
const pkg = require(resolve(`package.json`))

const plugins = [
  commonjs(),
  nodeResolve({ preferBuiltins: false }),
  esbuild({ target: 'node14' }),
  json()
]

const external = [
  ...Object.keys(pkg.dependencies),
  ...builtinModules.flatMap((m) =>
    m.includes('punycode') ? [] : [m, `node:${m}`]
  )
]

export default defineConfig([
  {
    input: resolve('src/index.ts'),
    output: [
      {
        format: 'esm',
        file: resolve('dist/index.js')
      },
      {
        format: 'cjs',
        file: resolve('dist/index.cjs')
      }
    ],
    plugins,
    external,
    onwarn(warning, warn) {
      if (warning.code !== 'EVAL') warn(warning)
    }
  },
  {
    input: resolve('src/index.ts'),
    output: {
      format: 'esm',
      file: resolve('dist/index.d.ts')
    },
    plugins: [dts({ respectExternal: true })],
    external
  }
])
