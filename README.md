# midjourney-sdk <a href="https://www.npmjs.com/package/midjourney-sdk"><img src="https://img.shields.io/npm/v/midjourney-sdk.svg?maxAge=3600" alt="npm version" /></a>

MidJourney in Discord API for Node.js.

_It's useful for you, please give me open source power、support and star✨ this repo._

## Demo

[Live demo](https://laibaoyuan.github.io/midjourney-sdk)

## Support

- Command
  - [x] `/imagine`
  - [x] `/info`
  - [x] `/settings`
  - [x] `/fast`
  - [x] `/relax`
- Button Action
  - [x] `upscale`
  - [x] `variation`
  - [x] `reroll`
  - [x] `zoomout`
  - [x] `vary(Region)`

## Install

```bash
pnpm i midjourney-sdk
```

## Usage

```typescript
import { MidJourney } from 'midjourney-sdk'
const ins = new MidJourney({
  token: import.meta.env.VITE_TOKEN,
  guild_id: import.meta.env.VITE_GUILD_ID,
  channel_id: import.meta.env.VITE_CHANNEL_ID,
  skipHeartbeat: true
})
;(async () => {
  await ins.init()
  const msg1 = await ins.api.imagine('apple --q 5', ({ url, progress }) => {
    console(url, progress)
  })
  const msg2 = await ins.api.action(
    'msgId',
    'customId',
    'msgFlags',
    ({ url, progress }) => {
      console(url, progress)
    }
  )
  const msg3 = await ins.api.varyRegion(
    'customId',
    'prompt',
    'mask',
    ({ url, progress }) => {
      console(url, progress)
    }
  )
})()
```

## Development

- edit environment `.env` file

```
# packages/playground/.env
VITE_TOKEN=
VITE_GUILD_ID=
VITE_CHANNEL_ID=
# discord api proxy url
VITE_API_BASE_URL=
# discord image proxy url
VITE_IMG_BASE_URL=
# discord websocket proxy url
VITE_WS_BASE_URL=
```

- run `dev` script

```bash
pnpm dev
```

- open `http://localhost:5173/midjourney-sdk`

# Proxy

- edit environment `.env` file

```
# packages/proxy/.env
HTTP_PROXY=http://localhost:7890
PORT=9000
```

- run `dev` script

```bash
pnpm proxy
```
