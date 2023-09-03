import EventEmitter from 'eventemitter3'
import WebSocket from 'isomorphic-ws'
import { MidJourneyFullOptions } from './types'

export const mjEventTypes = [
  'READY',
  'MESSAGE_CREATE',
  'MESSAGE_UPDATE',
  'MESSAGE_DELETE',
  'INTERACTION_CREATE',
  'INTERACTION_SUCCESS',

  'WS_OPEN',
  'WS_ERROR',
  'WS_CLOSE'
] as const

export type MjEventType = (typeof mjEventTypes)[number]

export class MidjourneyWs extends EventEmitter<MjEventType> {
  #ws: WebSocket
  #lastSequence: number | null = null
  #heartbeatTask: NodeJS.Timer | null = null
  #reconnectionTask: NodeJS.Timeout | null = null
  constructor(public opts: MidJourneyFullOptions) {
    super()
    this.#ws = this.#connect()
  }

  #connect() {
    const ws = new WebSocket(this.opts.wsBaseUrl)
    ws.addEventListener('open', () => {
      this.#emit('WS_OPEN')
      this.opts.debug?.('MidjourneyWs', '#connect')('ws is open!')
      if (this.#reconnectionTask) {
        clearTimeout(this.#reconnectionTask)
        this.#reconnectionTask = null
      }
    })
    ws.addEventListener('message', this.#message.bind(this))
    ws.addEventListener('error', (err) => {
      this.#emit('WS_ERROR', err)
      this.opts.debug?.(
        'MidjourneyWs',
        '#connect'
      )(`discord ws occurred an error: ${err.message}`)
      this.#ws.close()
    })
    ws.addEventListener('close', ({ code, reason }) => {
      this.#emit('WS_CLOSE', code, reason)
      this.opts.debug?.(
        'MidjourneyWs',
        '#connect'
      )(`discord ws was close, error code: ${code}, error reason: ${reason}`)
      this.#reconnectionTask = setTimeout(() => {
        this.opts.debug?.('MidjourneyWs', '#connect')('discord ws reconnect...')
        if (this.#heartbeatTask) {
          clearInterval(this.#heartbeatTask)
          this.#heartbeatTask = null
        }
        this.#ws = this.#connect.call(this)
      }, 4000)
    })
    return ws
  }

  #auth() {
    this.#ws.send(
      JSON.stringify({
        op: 2,
        d: {
          token: this.opts.token,
          capabilities: 16381,
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

  #heartbeat(interval: number) {
    const nextInterval = interval * Math.random()
    this.opts.debug?.(
      'MidjourneyWs',
      '#heartbeat'
    )(`send discord heartbeat after ${Math.round(nextInterval / 1000)}s`)
    this.#heartbeatTask = setTimeout(() => {
      if (this.#ws.readyState === WebSocket.OPEN) {
        this.#ws.send(
          JSON.stringify({
            op: 1,
            d: this.#lastSequence
          })
        )
        this.#heartbeat(interval)
      }
    }, nextInterval)
  }

  #message(e: WebSocket.MessageEvent) {
    const payload = JSON.parse(e.data as string)
    const data = payload.d
    const type = payload.t as MjEventType
    const seq = payload.s as number
    const operate = payload.op as number
    seq && (this.#lastSequence = seq)
    this.opts.debug?.(
      'MidjourneyWs',
      '#message'
    )(
      [
        { label: 'MessageType', value: type },
        { label: 'MessageOpCode', value: operate }
      ]
        .filter((v) => !!v.value)
        .map((v) => `${v.label}: ${v.value}`)
        .join(', ')
    )
    if (operate === 10) {
      this.#heartbeat(data.heartbeat_interval)
      this.#auth()
    }
    if (type === 'READY') {
      this.opts.session_id = data.session_id
      this.opts.debug?.('MidjourneyWs', '#message')('ws connect successfully!')
      this.#emit('READY', data.user)
    }
    if (
      type === 'MESSAGE_CREATE' ||
      type === 'MESSAGE_UPDATE' ||
      type === 'MESSAGE_DELETE'
    ) {
      this.#emit(type, data)
    }
    if (operate === 11) {
      this.opts.debug?.('MidjourneyWs', '#message')('discord heartbeat ack!')
    }
  }

  #emit(name: MjEventType, ...args: any) {
    return this.emit(name, ...args)
  }
}
