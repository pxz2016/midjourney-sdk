import { debug } from './utils'

export interface MidJourneyFullOptions {
  token: string
  guild_id: string
  channel_id: string
  session_id?: string
  debug?: typeof debug
  apiBaseUrl: string
  wsBaseUrl: string
  imgBaseUrl: string
  fetch: typeof fetch
}

export type MidJourneyOptions = Pick<
  MidJourneyFullOptions,
  'token' | 'channel_id' | 'guild_id'
> &
  Partial<Omit<MidJourneyFullOptions, 'token' | 'channel_id' | 'guild_id'>>

export interface MjMessage {
  id: string
  flags: number
  content: string
  url?: string
  progress?: number
  components?: any[]
  width?: number
  height?: number
}

export interface ApplicationCommond {
  version: string
  id: string
  name: string
  type: number
  options: { type: number; name: string; [key: string]: any }[]
  [key: string]: any
}
