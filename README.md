# midjourney-sdk <a href="https://www.npmjs.com/package/midjourney-sdk"><img src="https://img.shields.io/npm/v/midjourney-sdk.svg?maxAge=3600" alt="npm version" /></a>

Node.js SDK for the unofficial MidJourney API.

## fetures
- Create different channels on the same guild based on user IDs by invoke `createGuildChannel` method.
- According to channel_id to get channelMessage
- Send prompt to Midjournal by calling the `prompt` method.
- Exec a ButtonComponent action by calling the `action` method. you can get the CustomId in the discord bot Listen Event `messageCreate` callback with `discord.js`
- 支持中文翻译，要在构造函数中填写appid和secret，prompt的参数不会被翻译。

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
  channel_id: 'xxxxx' // the class methods will get this value by default if you set
})
```

## how can I get the session_id/guild_id/token
![](https://files.mdnice.com/user/36542/db42f1c9-b22f-4a72-bc9e-3f4e28c2de8c.png)
![](https://files.mdnice.com/user/36542/a7533387-c895-45eb-b3bb-a8cccc4a9762.png)
![](https://files.mdnice.com/user/36542/fbb01401-5a96-47c3-a3e8-66eee2dedace.png)

## Interface document

## MidJourneyOptions

- `token`: Discord user Token
- `guild_id`: Discord server ID
- `session_id`: Session ID
- `channel_id` (optional): Channel ID
- `baiduTranslate` (optional): baiduTranslate config
  - `appid`:  appid
  - `secret`: secret
- `version` (optional): Discord api version code (10 or 9)

## ChannelType

- `id`: Channel ID
- `name`: Channel Name
- `parent_id`: Category ID
- `type`: channel type
- `last_message_id`: last message ID
- `guild_id`: guild ID
- `flags`: flags
- other props...

## Translate

- `from`: source lang
- `to`: target lang
- `trans_result`: 
  - `src`: source
  - `dst`: result

## MidJourney

### Constructor

- `options`: MidJourneyOptions

### Methods

- `createGuildChannel(name: string, parent_id: string): Promise<ChannelType>`

  - create guild channel
  - `name`: channel name
  - `parent_id`: guild category id
  - return `Promise<ChannelType>`

- `getGuildChannels(): Promise<ChannelType[]>`

  - get guild all channels
  - return `Promise<ChannelType[]>`

- `getChannelMessages(channel_id?: string, limit?: number): Promise<Message<boolean>[]>`

  - get channel messages width limit by channel_id
  - `channel_id` (optional): channel_id which channel to get (default on constructor what you set)
  - `limit` (optional): limit messages limit num (default 50)
  - return `Promise<Message<boolean>[]>`

- `prompt(value: string, translate?: boolean, channel_id?: string): Promise<any>`

  - send imagine Prompt
  - `value`: value what prompt you want to send
  - `translate` (optional): translate prompt translate from en to zh
  - `channel_id` (optional): which channel to send (default on constructor what you set)
  - return null

- `action(message_id: string, custom_id: string, channel_id?: string): Promise<any>`

  - exec a discord's component action
  - `message_id`: message id
  - `custom_id`: component id
  - `channel_id` (optional): which channel to send (default on constructor what you set){string}
  - return null

- `translate(text: string, from?: string): Promise<Translate>`
  - 将文本翻译为英文
  - `text`: 要翻译的文本
  - `from` (可选): 翻译源语言
  - 返回 Promise，解析为 Translate 对象
