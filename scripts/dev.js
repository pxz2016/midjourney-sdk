import esbuild from 'esbuild'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../packages/midjourney-sdk/package.json')

const ROOT = fileURLToPath(import.meta.url)
const r = (p) => resolve(ROOT, '..', p)

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
]

esbuild
  .context({
    entryPoints: [r('../packages/midjourney-sdk/src/index.ts')],
    outfile: r('../packages/midjourney-sdk/dist/index.js'),
    format: 'esm',
    bundle: true,
    sourcemap: true,
    external
  })
  .then((ctx) => ctx.watch())
