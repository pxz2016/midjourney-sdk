import { WebSocket } from 'ws'
import { MidJourneyOptions, WsEventType } from './types'

export default class DiscordWs {
  // @ts-ignore
  protected wss: WebSocket
  private botToken: string
  private ws: MidJourneyOptions['ws']

  private heartbeatInterval: NodeJS.Timer | null = null
  private reconnectInterval = 3000
  constructor({ token, ws }: Pick<MidJourneyOptions, 'token' | 'ws'>) {
    this.ws = ws
    this.botToken = token
    this.#connect()
  }

  #connect() {
    this.wss = new WebSocket(
      'wss://gateway.discord.gg?v=9&encoding=json&compress=gzip-stream'
    )
    this.wss.on('open', this.#open.bind(this))
    this.wss.on('message', this.#message.bind(this))
    this.wss.on('close', this.#reconnect.bind(this))
    this.wss.on('error', this.#reconnect.bind(this))
  }

  #open() {
    this.wss.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.botToken,
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
    this.#startHeartbeat()
  }

  #message(data: Buffer) {
    const msg = JSON.parse(data.toString())
    const type = msg.t as WsEventType
    const payload = msg.d
    if (!type) {
      return
    }
    switch (type) {
      case 'READY':
        this.ws!('READY', payload.user)
        break
      case 'MESSAGE_CREATE':
        this.ws!('MESSAGE_CREATE', payload)
        break
      case 'MESSAGE_UPDATE':
        this.ws!('MESSAGE_UPDATE', payload)
        break
      case 'INTERACTION_SUCCESS':
        this.ws!('INTERACTION_SUCCESS', payload)
        break
      case 'INTERACTION_CREATE':
        this.ws!('INTERACTION_CREATE', payload)
    }
  }

  #reconnect() {
    this.#stopHeartbeat()
    setTimeout(() => {
      console.log('Reconnecting...')
      this.#connect()
    }, this.reconnectInterval)
  }

  #startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.wss.readyState === WebSocket.OPEN) {
        this.wss.ping()
      }
    }, 5000)
  }

  #stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }
}
