import { WebSocket, MessageEvent } from 'ws'
import DiscordRequest from './http'
import {
  MidJourneyOptions,
  commandType,
  ApplicationCommond,
  WsEventType,
  WsEventTypes
} from './types'

export default class MidjourneyCommand extends WebSocket {
  protected request: DiscordRequest
  protected channel_id: string
  protected session_id: string | undefined
  private caches: Partial<Record<commandType, ApplicationCommond>> = {}
  private token: MidJourneyOptions['token']
  private heartbeatInterval: NodeJS.Timer | null = null
  private lastEventNum: number | null = null
  constructor({
    token,
    version,
    channel_id
  }: Pick<MidJourneyOptions, 'token' | 'version' | 'channel_id'>) {
    if (!channel_id) throw new Error('channel_id is required')
    if (!token) throw new Error('token is required')
    super('wss://gateway.discord.gg?v=9&encoding=json&compress=gzip-stream')
    this.channel_id = channel_id
    this.token = token
    this.request = new DiscordRequest(token, version)
    this.onopen = this.#open.bind(this)
    this.onclose = this.#close.bind(this)
    this.on('message', this.#message.bind(this))
  }

  commands(command: commandType) {
    if (!this.caches[command]) {
      const searchParams = new URLSearchParams({
        type: '1',
        query: command,
        limit: '1',
        include_applications: 'false'
      })
      return this.request
        .get<{
          application_commands: ApplicationCommond[]
        }>(
          `/channels/${this.channel_id}/application-commands/search?${searchParams}`
        )
        .then(({ application_commands }) => {
          if (application_commands.length) {
            this.caches[command] = application_commands[0]
            return this.caches[command]
          } else {
            return Promise.reject('command not found')
          }
        })
    }
    return Promise.resolve(this.caches[command])
  }

  #open() {
    this.heartbeatInterval = setInterval(() => {
      if (this.readyState === WebSocket.OPEN) {
        this.send(
          JSON.stringify({
            op: 1,
            d: this.lastEventNum
          })
        )
      }
    }, 5000)
    this.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.token,
          capabilities: 8189,
          properties: {
            os: 'Mac OS X',
            browser: 'Chrome',
            device: ''
          },
          compress: false
        }
      })
    )
  }

  #message(msg: Buffer) {
    const payload = JSON.parse(msg.toString())
    const data = payload.d
    const type = payload.t as WsEventType
    const s = payload.s as number
    s && (this.lastEventNum = s)
    if (type === WsEventTypes[0]) {
      this.session_id = data.session_id
    }
  }

  #close() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }
}
