import { defineConfig } from 'rollup'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import json from '@rollup/plugin-json'
import { builtinModules, createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const ROOT = fileURLToPath(import.meta.url)
const r = (p: string) => resolve(ROOT, '..', p)

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
    input: r('src/index.ts'),
    output: [
      {
        format: 'esm',
        file: 'dist/index.js'
      },
      {
        format: 'cjs',
        file: 'dist/index.cjs'
      }
    ],
    plugins,
    external,
    onwarn(warning, warn) {
      if (warning.code !== 'EVAL') warn(warning)
    }
  },
  {
    input: r('src/index.ts'),
    output: {
      format: 'esm',
      file: 'dist/index.d.ts'
    },
    plugins: [dts({ compilerOptions: { baseUrl: '.' } })],
    external
  }
])
