import { debug } from './utils'
import { MidjourneyWs } from './ws'

export type InitStatus = 'not_initialized' | 'initializing' | 'initialized'

export interface MidJourneyFullOptions {
  token: string
  guild_id: string
  channel_id: string
  session_id?: string
  debug?: typeof debug
  skipHeartbeat: boolean
  remix: boolean
  apiBaseUrl: string
  wsBaseUrl: string
  imgBaseUrl: string
  fetch: typeof fetch
  ws?: MidjourneyWs
  user?: MjOriginMessage['user']
  initialize: InitStatus
}

export type MidJourneyOptions = Pick<
  MidJourneyFullOptions,
  'token' | 'channel_id' | 'guild_id'
> &
  Partial<
    Omit<
      MidJourneyFullOptions,
      | 'token'
      | 'channel_id'
      | 'guild_id'
      | 'remix'
      | 'ws'
      | 'user'
      | 'initialize'
    >
  >

export interface ApplicationCommond {
  version: string
  id: string
  name: string
  type: number
  options: { type: number; name: string; [key: string]: any }[]
  [key: string]: any
}

export interface MjOriginMessage {
  id: string
  flags: number
  content: string
  type: 0 | 19 | 20
  components: { components: any[] }[]
  attachments: {
    filename: string
    url: string
    height: number
    width: number
  }[]
  timestamp: string
  channel_id: string
  interaction: { name: string }
  embeds: {
    description: string
    title: string
    color: number
    type: string
    footer: { text: string }
  }[]
  message_reference: { message_id: string }
  nonce?: string
  heartbeat_interval?: number
  session_id?: string
  user?: any
}

export interface MjMessage {
  id: string
  nonce?: string
  flags?: number
  content?: string
  url?: string
  embed?: MjOriginMessage['embeds'][number]
  progress?: number
  components?: MjOriginMessage['components']
  originId?: string
  parentId?: string
  deleted?: boolean
  timestamp?: string
  [key: string]: any
}

export interface MessageCallBack {
  (type: MjMsgType, msg: MjMessage): void
}

export interface MjEvents extends Record<string, MessageCallBack> {
  READY: (user: MjOriginMessage['user']) => void
  WS_OPEN: () => void
  WS_ERROR: (error: string) => void
  WS_CLOSE: () => void
}

export type MjMsgType = 'MESSAGE_CREATE' | 'MESSAGE_UPDATE' | 'MESSAGE_DELETE'
