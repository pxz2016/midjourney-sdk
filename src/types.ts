import { WsEventTypes, commands } from './constant'

export interface MidJourneyOptions {
  /**
   * discord user token
   */
  token: string
  /**
   * discord server id
   */
  guild_id: string
  channel_id: string
  /**
   * discord api version
   * @default '9'
   */
  version?: 10 | 9
  debug?: boolean
}

export type WsEventType = (typeof WsEventTypes)[number]

export type commandType = (typeof commands)[number]

export interface ApplicationCommond {
  version: string
  id: string
  name: string
  type: number
  options: { type: number; name: string; [key: string]: any }[]
  [key: string]: any
}
