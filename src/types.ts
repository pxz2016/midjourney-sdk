export interface MidJourneyOptions {
  /**
   * discord user token
   */
  token: string
  /**
   * discord server id
   */
  guild_id: string
  session_id: string
  channel_id?: string
  baiduTranslate?: BaiDuTranslateConfig
  version?: 10 | 9
}

export interface BaiDuTranslateConfig {
  appid: string
  secret: string
}

export interface ChannelType {
  id: string
  /**
   * channel name
   */
  name: string
  /**
   * guild category id
   */
  parent_id: string
  type: string
  last_message_id: string
  guild_id: string
  flags: number
  [key: string]: any
}

export interface Translate {
  from: string
  to: string
  trans_result: { src: string; dst: string }[]
}
