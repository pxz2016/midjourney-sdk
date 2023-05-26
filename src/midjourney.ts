import { DiscordRequest } from './utils'
import { MidJourneyOptions, BaiDuTranslateConfig } from './types'
import crypto from 'crypto-js'
import { Client, GatewayIntentBits, Message } from 'discord.js'

export class MidJourney {
  private request: DiscordRequest
  private _discord: Client
  private guild_id: string
  private session_id: string
  private baiduConfig?: BaiDuTranslateConfig

  constructor(options: MidJourneyOptions) {
    this.guild_id = options.guild_id
    this.session_id = options.session_id
    options.baiduTranslate && (this.baiduConfig = options.baiduTranslate)
    this.request = new DiscordRequest(options.userToken)
    this._discord = new Client(
      Object.assign(
        {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages
          ]
        },
        options.discordConfig
      )
    )
    this._discord.login(options.botToken)
  }

  get discord() {
    return this._discord
  }

  /**
   * create guild channel
   * @param name channel name
   * @param parent_id guild category id
   * @returns
   */
  createGuildChannel(name: string, parent_id: string) {
    return this.request.post(
      `https://discord.com/api/v9/guilds/${this.guild_id}/channels`,
      {
        type: 0,
        name,
        permission_overwrites: [],
        parent_id
      }
    )
  }

  /**
   * send imagine Prompt
   * @param value
   * @param translate prompt translate from en to zh
   * @returns
   */
  async sendPrompt(value: string, translate: boolean = false) {
    if (translate) {
      value = await this.translate(value).then((res) => res.trans_result[0].dst)
    }
    return this.request.post('/api/v9/interactions', {
      type: 2,
      application_id: '936929561302675456',
      session_id: this.session_id,
      guild_id: this.guild_id,
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

  translate(text: string) {
    if (!this.baiduConfig)
      throw new Error('Please Configuration baidutranslateConfig')
    const { appid, secret } = this.baiduConfig
    let salt = Date.now()
    let str = `${appid}${text}${salt}${secret}`
    let sign = crypto.MD5(str)
    return this.request.get<{
      from: string
      to: string
      trans_result: { src: string; dst: string }[]
    }>(
      `http://api.fanyi.baidu.com/api/trans/vip/translate?q=${text}&from=zh&to=en&appid=${appid}&salt=${salt}&sign=${sign}`
    )
  }
}
