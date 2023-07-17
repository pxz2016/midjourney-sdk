# midjourney-sdk <a href="https://www.npmjs.com/package/midjourney-sdk"><img src="https://img.shields.io/npm/v/midjourney-sdk.svg?maxAge=3600" alt="npm version" /></a>

MidJourney in Discord API for Node.js.

## Install

```bash
pnpm i midjourney-sdk
```

## Usage

```typescript
import { MidJourney } from 'midjourney-sdk'
const mj = new MidJourney({
  guild_id: 'xxxxx',
  token: 'xxxxx',
  channel_id: 'xxxxx',
  debug: true
  // version: 9, # discord api version
})

// listen midjourney message callback
mj.on('message', (msg) => {
  const payload = JSON.parse(msg.toString())
  const type = payload.t as WsEventType
  const data = payload.d
  switch (type) {
    case 'READY':
      console.log(data.user)
      break
    case 'MESSAGE_CREATE':
      console.log(data)
      break
    case 'MESSAGE_UPDATE':
      console.log(data)
      break
    case 'INTERACTION_SUCCESS':
      console.log(data)
      break
    case 'INTERACTION_CREATE':
      console.log(data)
      break
  }
})

// you can receive the image url on listen `MESSAGE_CREATE` or `MESSAGE_UPDATE` type of the `message` event
await mj.imagine('ferrari --q 5 --ar 16:9')
```

## Test & Development

- edit environment `.env` file

```
CHANNEL_ID=
GUILD_ID=
TOKEN=
```

- run `dev` script

```bash
pnpm dev
```

## Methods

> - `msg_id`: current message id
> - `msg_hash`: current image id, you can get with `url.split('_').at(-1).split('.')[0]`
> - `size`: `50` is 2x or `75` is 1.5x
> - `submitCustomZoom 's msg_id` is not id by the photo，that is dialog message id，you can listen event `INTERACTION_CREATE` or `INTERACTION_SUCCESS` payload

- [x] `imagine`: trigger `imagine job` with midjourney
- [x] `action`: execute `upscale`、`variation` or `reroll` and so on by `custom_id`
- [x] `upscale`: trigger `U` Button Component Event
- [x] `variation`: trigger `V` Button Component Event
- [x] `reroll`: trigger `🔄` Button Component Event
- [x] `zoomOut`: trigger `Zoom Out 2x` or `Zoom Out 1.5x` Button Component Event
- [x] `customZoom`: trigger `Custom Zoom` Button Component Event
- [x] `submitCustomZoom`: submit `Custom Zoom` form
- [x] `info`: trigger `/info` comman
- [x] `settings`: trigger `/settings` command
- [x] `fast`: toggle `fast` mode in global
- [x] `relax`: toggle `relax` mode in global

## Contributing

Have a feature you'd like to see added? Create a [pull request](https://github.com/LaiBaoYuan/midjourney-sdk/pulls) or open an [issue](https://github.com/LaiBaoYuan/midjourney-sdk/issues).
