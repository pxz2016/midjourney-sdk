import { WebSocket } from 'ws'
import DiscordRequest from './http'
import {
  ApplicationCommond,
  MidJourneyOptions,
  WsEventType,
  commandType
} from './types'
import { WS_URL, WsEventTypes } from './constant'
import EventEmitter from 'events'

export default class MidjourneyBase extends EventEmitter {
  protected options: MidJourneyOptions
  protected request: DiscordRequest
  protected session_id: string | undefined
  #ws: WebSocket
  #caches: Partial<Record<commandType, ApplicationCommond>> = {}
  #reconnectionTask: NodeJS.Timeout | null = null
  #heartbeatTask: NodeJS.Timer | null = null
  #lastSequence: number | null = null

  constructor(options: MidJourneyOptions) {
    super()
    if (!options.guild_id) throw new Error('guild_id is required')
    if (!options.channel_id) throw new Error('channel_id is required')
    if (!options.token) throw new Error('token is required')
    this.options = options
    this.request = new DiscordRequest(options.token, options.version)
    this.#ws = this.#connect()
  }

  #connect() {
    const ws = new WebSocket(WS_URL)
    ws.on('open', () => {
      this.emit('open')
      this.debug('discord ws connect successfully!')
      if (this.#reconnectionTask) {
        clearTimeout(this.#reconnectionTask)
        this.#reconnectionTask = null
      }
      this.#ws.send(
        JSON.stringify({
          op: 2,
          d: {
            token: this.options.token,
            properties: {
              os: 'Mac OS X',
              browser: 'Chrome',
              device: ''
            },
            compress: false
          }
        })
      )
    })
    ws.on('message', this.#message.bind(this))
    ws.on('error', (err) => {
      this.emit('error', err)
      this.debug(`discord ws occurred an error: ${err.message}`)
      this.#ws.close()
    })
    ws.on('close', (code, reason) => {
      this.emit('close', code, reason)
      this.debug(
        `discord ws was close, error code: ${code}, error reason: ${reason}`
      )
      this.#reconnectionTask = setTimeout(() => {
        this.debug('discord ws reconnect...')
        if (this.#heartbeatTask) {
          clearInterval(this.#heartbeatTask)
          this.#heartbeatTask = null
        }
        this.#ws = this.#connect.call(this)
      }, 4000)
    })
    return ws
  }

  #message(msg: Buffer) {
    const payload = JSON.parse(msg.toString())
    this.emit('message', payload)
    const data = payload.d
    const type = payload.t as WsEventType
    const seq = payload.s as number
    const operate = payload.op as number
    seq && (this.#lastSequence = seq)
    if (operate === 10) {
      this.#heartbeatTask = setInterval(() => {
        if (this.#ws.readyState === WebSocket.OPEN) {
          this.#ws.send(
            JSON.stringify({
              op: 1,
              d: this.#lastSequence
            })
          )
        }
      }, data.heartbeat_interval * Math.random())
    }
    if (type === WsEventTypes[0]) {
      this.debug(
        'discord user login already! you can do everything what you want'
      )
      this.session_id = data.session_id
    }
    if (operate === 11) {
      this.debug('receive discord heartbeat ack')
    }
  }

  protected commands(command: commandType) {
    if (!this.#caches[command]) {
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
          `/channels/${this.options.channel_id}/application-commands/search?${searchParams}`
        )
        .then(({ application_commands }) => {
          if (application_commands.length) {
            this.#caches[command] = application_commands[0]
            return this.#caches[command]
          } else {
            return Promise.reject('command not found')
          }
        })
    }
    return Promise.resolve(this.#caches[command])
  }

  protected debug(msg: string) {
    if (this.options.debug) {
      console.log(`[MIDJOURNEY DEBUG LOG]: ${msg}`)
    }
  }
}
