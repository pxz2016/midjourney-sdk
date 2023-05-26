import { ClientOptions } from 'discord.js'

export interface MidJourneyOptions {
  userToken: string
  botToken: string
  guild_id: string
  session_id: string
  channel_id: string
  discordConfig?: ClientOptions
  baiduTranslate?: BaiDuTranslateConfig
}

export interface BaiDuTranslateConfig {
  appid: string
  secret: string
}
