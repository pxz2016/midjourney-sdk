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
  /**
   * discord api version
   */
  version?: 10 | 9
  /**
   * midjourney command version
   * @default '1118961510123847772'
   */
  mj_version?: string
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

export interface IPrompt {
  /**
   * value what prompt you want to send
   */
  value: string
  /**
   * translate prompt translate from en to zh
   */
  translate?: (val: string) => string
  /**
   * channel_id which channel to send (default on constructor what you set)
   */
  channel_id?: string
}
