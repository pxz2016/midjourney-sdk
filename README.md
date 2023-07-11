# midjourney-sdk <a href="https://www.npmjs.com/package/midjourney-sdk"><img src="https://img.shields.io/npm/v/midjourney-sdk.svg?maxAge=3600" alt="npm version" /></a>

MidJourney in Discord API for Node.js.

## UML

```mermaid
sequenceDiagram
    participant ThirdServer
    participant APIServer
    participant DiscordAPI

    ThirdServer->>APIServer: request api trigger task
    APIServer->>APIServer: join in job tasks
    APIServer->>DiscordAPI: invoke api to trigger task
    APIServer-->>ThirdServer: callback trigger result

    DiscordAPI->>DiscordAPI: listen Midjourney bot tasks
    DiscordAPI->>DiscordAPI: listen MidJourney bot message
    DiscordAPI-->>ThirdServer: callback the message what the listen
    DiscordAPI-->>APIServer: clear tasks
```

## Install

npm

```bash
npm i midjourney-sdk
```

yarn

```bash
yarn install midjourney-sdk
```

pnpm

```bash
pnpm i midjourney-sdk
```

## Usage

```typescript
import { MidJourney } from 'midjourney-sdk'
const mj = new MidJourney({
  session_id: 'xxxxx',
  guild_id: 'xxxxx',
  token: 'xxxxx',
  channel_id: 'xxxxx',
  ws: (type, payload) => {
    console.log(type, payload) // do something
  }
  // version: 9, # discord api version
})
```

## Test & Development

- edit environment `.env` file

```bash
pnpm dev
```

## Methods

1. `imagine`: trigger `imagine job` with midjourney

- `value`: the image prompt

2. `upscale`: trigger `U` Button Component Event

- `index`: the index of the `U` Button
- `msg_id`: current message id
- `msg_hash`: current image id, you can get with `url.split('_').at(-1).split('.')[0]`

3. `variation`: trigger `V` Button Component Event

- `index`: the index of the `V` Button
- `msg_id`: current message id
- `msg_hash`: current image id, you can get with `url.split('_').at(-1).split('.')[0]`

4. `reroll`: trigger `🔄` Button Component Event

- `msg_id`: current message id
- `msg_hash`: current image id, you can get with `url.split('_').at(-1).split('.')[0]`

5. `zoomOut`: trigger `Zoom Out 2x` or `Zoom Out 1.5x` Button Component Event

- `size`: `50` is 2x or `75` is 1.5x
- `msg_id`: current message id
- `msg_hash`: current image id, you can get with `url.split('_').at(-1).split('.')[0]`

6. `customZoom`: trigger `Custom Zoom` Button Component Event

- `msg_id`: current message id
- `msg_hash`: current image id, you can get with `url.split('_').at(-1).split('.')[0]`

7. `submitCustomZoom`: submit `Custom Zoom` form

- `msg_id`: this msg_id is not id by the photo，that is dialog message id，you can get with `ws` option to listen ws event `INTERACTION_CREATE` or `INTERACTION_SUCCESS` payload
- `msg_hash`: current image id, you can get with `url.split('_').at(-1).split('.')[0]`
- `value`: submit value

8. `info`: trigger `/info` command
9. `settings`: trigger `/settings` command
10. `fast`: toggle `fast` mode in global
11. `relax`: toggle `relax` mode in global
