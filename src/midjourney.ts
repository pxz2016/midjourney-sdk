import DiscordRequest from './http'
import {
  MidJourneyOptions,
  BaiDuTranslateConfig,
  ChannelType,
  Translate
} from './types'
import crypto from 'crypto-js'
import { Message } from 'discord.js'
export class MidJourney {
  private request: DiscordRequest
  private guild_id: string
  private session_id: string
  private channel_id?: string
  private baiduTranslate?: BaiDuTranslateConfig

  constructor(options: MidJourneyOptions) {
    let { guild_id, session_id, channel_id, baiduTranslate, token, version } =
      options
    if (!guild_id) throw new Error('guild_id is required')
    if (!session_id) throw new Error('session_id is required')
    this.guild_id = guild_id
    this.session_id = session_id
    this.channel_id = channel_id
    this.baiduTranslate = baiduTranslate
    this.request = new DiscordRequest(token, version)
  }

  /**
   * create guild channel
   * @param {string} name channel name
   * @param {string} parent_id guild category id
   * @returns {ChannelType} channel info
   */
  createGuildChannel(name: string, parent_id: string) {
    return this.request.post<ChannelType>(`/guilds/${this.guild_id}/channels`, {
      type: 0,
      name,
      parent_id
    })
  }

  /**
   * get guild all channels
   * @returns {ChannelType[]} Array of Channel info
   */
  getGuildChannels() {
    return this.request.get<ChannelType[]>(`/guilds/${this.guild_id}/channels`)
  }

  /**
   * get channel messages width limit by channel_id
   * @param {string} channel_id which channel to get (default on constructor what you set)
   * @param {number} limit messages limit num (default 50)
   * @returns {Message[]} Array of Message
   */
  getChannelMessages(channel_id = this.channel_id, limit = 50) {
    if (!channel_id) throw new Error('channel_id is empty')
    return this.request.get<Message[]>(
      `/channels/${channel_id}/messages?limit=${limit}`
    )
  }

  /**
   * send imagine Prompt
   * @param {string} value what prompt you want to send
   * @param {boolean} translate prompt translate from en to zh
   * @param {string} channel_id which channel to send (default on constructor what you set)
   * @returns {null} no return
   */
  async prompt(value: string, translate = false, channel_id = this.channel_id) {
    if (!channel_id) throw new Error('channel_id is empty')
    if (translate) {
      const regex = /--(\w+)\s+([^-\s]+)/g
      const matches = value.match(regex) ?? []
      value = await this.translate(value.replace(regex, '').trim()).then(
        (res) => res.trans_result[0].dst.concat(` ${matches.join(' ')}`)
      )
    }
    return this.request.post('/interactions', {
      type: 2,
      application_id: '936929561302675456',
      session_id: this.session_id,
      guild_id: this.guild_id,
      channel_id,
      data: {
        version: '1077969938624553050',
        id: '938956540159881230',
        name: 'imagine',
        type: 1,
        options: [
          {
            type: 3,
            name: 'prompt',
            value
          }
        ],
        application_command: {
          id: '938956540159881230',
          application_id: '936929561302675456',
          version: '1077969938624553050',
          default_member_permissions: null,
          type: 1,
          nsfw: false,
          name: 'imagine',
          description: 'Create images with Midjourney',
          dm_permission: true,
          contexts: null,
          options: [
            {
              type: 3,
              name: 'prompt',
              description: 'The prompt to imagine',
              required: true
            }
          ]
        },
        attachments: []
      }
    })
  }

  /**
   * exec a discord's component action
   * @param {string} message_id message id
   * @param {string} custom_id component id
   * @param {string} channel_id which channel to send (default on constructor what you set){string}
   * @returns no return
   */
  action(message_id: string, custom_id: string, channel_id = this.channel_id) {
    if (!channel_id) throw new Error('channel_id is empty')
    return this.request.post('/interactions', {
      type: 3,
      message_id,
      application_id: '936929561302675456',
      session_id: this.session_id,
      guild_id: this.guild_id,
      channel_id,
      data: {
        component_type: 2,
        custom_id
      }
    })
  }

  /**
   * translate text to en
   * @param {string} text translate text
   * @param {string} from be translate language
   * @returns {Translate} translate result
   */
  translate(text: string, from = 'zh') {
    if (!this.baiduTranslate) throw new Error('baiduTranslate is not config')
    const { appid, secret } = this.baiduTranslate
    let salt = Date.now()
    let str = `${appid}${text}${salt}${secret}`
    let sign = crypto.MD5(str)
    return this.request.get<Translate>(
      `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${text}&from=${from}&to=en&appid=${appid}&salt=${salt}&sign=${sign}`
    )
  }
}
