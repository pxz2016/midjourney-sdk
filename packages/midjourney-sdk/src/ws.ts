import EventEmitter from 'eventemitter3'
import WebSocket from 'isomorphic-ws'
import {
  MessageCallBack,
  MidJourneyFullOptions,
  MjMessage,
  MjOriginMessage
} from './types'
import { formatComponents, getContentNonce } from './utils'
import { MidjourneyMsgMap } from './msgMap'

export interface MjEvents {
  READY: (user: MjOriginMessage['user']) => void
  MESSAGE_CREATE: (msg: MjMessage) => void
  MESSAGE_UPDATE: (msg: MjMessage) => void
  MESSAGE_DELETE: (msg: MjMessage) => void
  SETTINGS: (msg: MjOriginMessage) => void
  INFO: (msg: MjOriginMessage) => void

  WS_OPEN: () => void
  WS_ERROR: (err: WebSocket.ErrorEvent) => void
  WS_CLOSE: (code: number, reason: string) => void
  [key: number]: (msg: MjMessage) => void
}

export type MjEventType = keyof MjEvents

export class MidjourneyWs extends EventEmitter<MjEvents> {
  #ws: WebSocket
  #lastSequence: number | null = null
  #heartbeatTask: NodeJS.Timer | null = null
  #reconnectionTask: NodeJS.Timeout | null = null

  msgMap = new MidjourneyMsgMap()
  constructor(public opts: MidJourneyFullOptions) {
    super()
    this.#ws = this.#connect()
  }

  #connect() {
    console.log(this.opts.wsBaseUrl)
    const ws = new WebSocket(this.opts.wsBaseUrl)
    ws.addEventListener('open', () => {
      this.emit('WS_OPEN')
      this.opts.debug?.('MidjourneyWs', '#connect')('ws is open!')
      if (this.#reconnectionTask) {
        clearTimeout(this.#reconnectionTask)
        this.#reconnectionTask = null
      }
    })
    ws.addEventListener('message', this.#message.bind(this))
    ws.addEventListener('error', (err) => {
      this.emit('WS_ERROR', err)
      this.opts.debug?.(
        'MidjourneyWs',
        '#connect'
      )(`discord ws occurred an error: ${err.message}`)
      this.#ws.close()
    })
    ws.addEventListener('close', ({ code, reason }) => {
      this.emit('WS_CLOSE', code, reason)
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
    !this.opts.skipHeartbeat &&
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
    const data = payload.d as MjOriginMessage
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
      this.#heartbeat(data.heartbeat_interval!)
      this.#auth()
    }
    if (type === 'READY') {
      this.opts.session_id = data.session_id
      this.opts.user = data.user
      this.opts.debug?.('MidjourneyWs', '#message')('ws connect successfully!')
      this.emit('READY', data.user)
    }
    if (
      type === 'MESSAGE_CREATE' ||
      type === 'MESSAGE_UPDATE' ||
      type === 'MESSAGE_DELETE'
    ) {
      console.log(data)

      this.handleMessage(type, data)
    }
    if (operate === 11) {
      !this.opts.skipHeartbeat &&
        this.opts.debug?.('MidjourneyWs', '#message')('discord heartbeat ack!')
    }
  }

  handleMessage(
    type: 'MESSAGE_CREATE' | 'MESSAGE_UPDATE' | 'MESSAGE_DELETE',
    message: MjOriginMessage
  ) {
    if (message.channel_id !== this.opts.channel_id) return
    if (type === 'MESSAGE_CREATE') this.handleMessageCreate(message)
    else if (type === 'MESSAGE_UPDATE') this.handleMessageUpdate(message)
    else this.handleMessageDelete(message)
  }

  handleMessageCreate(message: MjOriginMessage) {
    const { nonce, id, components, attachments, embeds } = message
    if (nonce) {
      this.msgMap.updateMsgByNonce(id, nonce)
      if (embeds[0]) {
        const { color, description, title } = embeds[0]
        switch (color) {
          case 16711680:
            this.emitError(id, embeds[0])
            break
          default:
            break
        }
      }
    }
    this.handleMessageUpdate(message)
  }
  handleMessageUpdate(message: MjOriginMessage) {
    const {
      content,
      embeds,
      interaction = {} as MjOriginMessage['interaction'],
      nonce,
      id,
      components
    } = message
    if (!nonce) {
      const { name } = interaction

      switch (name) {
        case 'settings':
          this.emit('SETTINGS', message)
          return
        case 'info':
          this.emit('INFO', message)
          return
      }
    }
    if (content) {
      this.processingImage(message)
    }
  }
  handleMessageDelete({ id }: MjOriginMessage) {
    const delMsg = this.msgMap.delMsgById(id)
    delMsg &&
      delMsg.nonce &&
      this.emit(parseInt(delMsg.nonce), { ...delMsg, progress: 100 })
  }

  processingImage(message: MjOriginMessage) {
    const { content, id, attachments, flags, components, nonce, timestamp } =
      message
    let msg = this.msgMap.getMsgById(id)
    let jobNonce = msg?.nonce || getContentNonce(content)
    if (!jobNonce) return
    if (!msg) {
      msg = this.msgMap.get(jobNonce)
    }
    let url = attachments.at(0)?.url
    if (url && this.opts.imgBaseUrl) {
      url = url.replace('https://cdn.discordapp.com', this.opts.imgBaseUrl)
    }
    const progressMatch = content.match(/\((\d+?)%\)\s\(\w+?\)/)?.[1]
    const isNewCreateMsg = !nonce && attachments.length && components.length
    const progress = isNewCreateMsg
      ? 100
      : progressMatch
      ? parseInt(progressMatch)
      : 0
    const mjMsg = JSON.parse(
      JSON.stringify({
        id,
        originId: msg && msg.id !== message.id ? msg.id : undefined,
        url,
        content,
        flags,
        components,
        progress,
        timestamp
      })
    )
    this.emit(parseInt(jobNonce), mjMsg) && this.msgMap.set(jobNonce, mjMsg)
  }

  emitError(id: string, error: MjMessage['error']) {
    const msg = this.msgMap.getMsgById(id)
    if (!msg) return
    msg.error = error
    this.emit(parseInt(msg.nonce!), msg)
  }

  waitReady() {
    return new Promise<MjMessage>((s) => {
      this.once('READY', s)
    })
  }

  waitImageMessage({
    nonce,
    cb
  }: {
    nonce: string
    cb: (msg: MjMessage) => void
  }) {
    this.msgMap.set(nonce, { id: '', nonce })
    return new Promise<MjMessage>((s, j) => {
      this.on(parseInt(nonce), (msg) => {
        cb(msg)
        if (msg.error) {
          this.off(parseInt(nonce))
          j(msg.error)
          return
        }
        if (msg.progress === 100) {
          this.off(parseInt(nonce))
          s(msg)
          return
        }
      })
    })
  }

  waitSetting(cb?: MessageCallBack) {
    return new Promise<MjMessage>((s) => {
      this.once('SETTINGS', ({ id, components }) => {
        cb?.({
          id,
          components: formatComponents(components)
        })
        s({
          id,
          components: formatComponents(components)
        })
      })
    })
  }

  waitInfo(cb?: MessageCallBack) {
    return new Promise<MjMessage>((s) => {
      this.once('INFO', ({ id, embeds }) => {
        cb?.({
          id,
          content: embeds.at(0)?.description
        })
        s({
          id,
          content: embeds.at(0)?.description
        })
      })
    })
  }
}
