# midjourney-sdk <a href="https://www.npmjs.com/package/midjourney-sdk"><img src="https://img.shields.io/npm/v/midjourney-sdk.svg?maxAge=3600" alt="npm version" /></a>

MidJourney in Discord API for Node.js.

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
})(async () => {
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
})()
```

## Development

- edit environment `.env` file

```
# packages/playground/.env
VITE_TOKEN=
VITE_GUILD_ID=
VITE_CHANNEL_ID=
VITE_API_BASE_URL=
VITE_IMG_BASE_URL=
VITE_WS_BASE_URL=
```

- run `dev` script

```bash
pnpm dev
```

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
