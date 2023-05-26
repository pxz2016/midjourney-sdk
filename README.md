# midjourney-api <a href="https://www.npmjs.com/package/midjourney-sdk"><img src="https://img.shields.io/npm/v/midjourney-sdk.svg?maxAge=3600" alt="npm version" /></a>

Node.js SDK for the unofficial MidJourney API.

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
  token: 'xxxxx'
  // channel_id: 'xxxxx'
})
```

## 接口说明文档

## MidJourneyOptions

- `token`: Discord 用户令牌
- `guild_id`: Discord 服务器 ID
- `session_id`: 会话 ID
- `channel_id` (可选): 频道 ID
- `baiduTranslate` (可选): 百度翻译配置
  - `appid`: 应用程序 ID
  - `secret`: 密钥
- `version` (可选): 版本号 (10 或 9)

## ChannelType

- `id`: 频道 ID
- `name`: 频道名称
- `parent_id`: 服务器分类 ID
- `type`: 频道类型
- `last_message_id`: 最后一条消息 ID
- `guild_id`: 服务器 ID
- `flags`: 标志
- 其他自定义属性...

## Translate

- `from`: 翻译源语言
- `to`: 翻译目标语言
- `trans_result`: 翻译结果数组
  - `src`: 原文
  - `dst`: 译文

## MidJourney

### 构造函数

- `options`: MidJourneyOptions 对象

### 方法

- `createGuildChannel(name: string, parent_id: string): Promise<ChannelType>`

  - 创建服务器频道
  - `name`: 频道名称
  - `parent_id`: 服务器分类 ID
  - 返回 Promise，解析为 ChannelType 对象

- `getGuildChannels(): Promise<ChannelType[]>`

  - 获取服务器的所有频道
  - 返回 Promise，解析为 ChannelType 对象数组

- `getChannelMessages(channel_id?: string, limit?: number): Promise<Message<boolean>[]>`

  - 获取指定频道的消息（默认为构造函数中设置的频道）
  - `channel_id` (可选): 频道 ID
  - `limit` (可选): 消息数量限制（默认为 50）
  - 返回 Promise，解析为 Message 对象数组

- `prompt(value: string, translate?: boolean, channel_id?: string): Promise<any>`

  - 发送想象中的提示
  - `value`: 要发送的提示内容
  - `translate` (可选): 是否将提示从英文翻译为中文
  - `channel_id` (可选): 频道 ID（默认为构造函数中设置的频道）
  - 返回 Promise，解析为任意类型

- `action(message_id: string, custom_id: string, channel_id?: string): Promise<any>`

  - 执行 Discord 组件的操作
  - `message_id`: 消息 ID
  - `custom_id`: 组件 ID
  - `channel_id` (可选): 频道 ID（默认为构造函数中设置的频道）
  - 返回 Promise，解析为任意类型

- `translate(text: string, from?: string): Promise<Translate>`
  - 将文本翻译为英文
  - `text`: 要翻译的文本
  - `from` (可选): 翻译源语言
  - 返回 Promise，解析为 Translate 对象
