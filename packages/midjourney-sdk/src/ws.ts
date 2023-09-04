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
  [key: number]: (type: MjMsgType, msg: MjMessage) => void
}

export type MjEventType = keyof MjEvents

export type MjMsgType = 'MESSAGE_CREATE' | 'MESSAGE_UPDATE' | 'MESSAGE_DELETE'

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
    if (!this.opts.wsBaseUrl) throw new Error("wsBaseUrl can't be empty")
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

  handleMessage(type: MjMsgType, message: MjOriginMessage) {
    if (message.channel_id !== this.opts.channel_id) return
    if (type === 'MESSAGE_CREATE') this.handleMessageCreate(message)
    else if (type === 'MESSAGE_UPDATE')
      this.handleMessageUpdate('MESSAGE_UPDATE', message)
    else this.handleMessageDelete(message)
  }

  handleMessageCreate(message: MjOriginMessage) {
    const { nonce, id, components, attachments, embeds } = message
    if (nonce) {
      this.msgMap.updateMsgByNonce(id, nonce)
      if (embeds[0]) {
        const { color } = embeds[0]
        switch (color) {
          case 16711680:
            this.emitEmbed(id, 'MESSAGE_CREATE', embeds[0])
            break
          default:
            break
        }
      }
    }
    this.handleMessageUpdate('MESSAGE_CREATE', message)
  }
  handleMessageUpdate(type: MjMsgType, message: MjOriginMessage) {
    const {
      content,
      interaction = {} as MjOriginMessage['interaction'],
      nonce,
      components,
      embeds,
      id
    } = message
    if (!nonce) {
      const { name } = interaction
      const msg = this.msgMap.getMsgById(id)
      if (msg && msg.nonce) {
        switch (name) {
          case 'settings':
            this.emitNonce(msg.nonce, type, {
              id,
              components,
              progress: 100
            })
            return
          case 'info':
            embeds.at(0) &&
              this.emitNonce(msg.nonce, type, {
                id,
                embed: embeds[0],
                progress: 100
              })
            return
        }
      }
    }
    if (content) {
      this.processingImage(type, message)
    }
  }
  handleMessageDelete({ id }: MjOriginMessage) {
    // const delMsg = this.msgMap.delMsgById(id)
    // delMsg &&
    //   delMsg.nonce &&
    //   this.emit(parseInt(delMsg.nonce), { ...delMsg, progress: 100 })
    this.emitNonce(id, 'MESSAGE_DELETE', { progress: 100 })
  }

  emitNonce(idOrNonce: string, type: MjMsgType, msg: Partial<MjMessage>) {
    const oldMsg =
      this.msgMap.get(idOrNonce) ||
      this.msgMap.getMsgById(idOrNonce) ||
      this.msgMap.getMsgByparentId(idOrNonce)
    if (type === 'MESSAGE_DELETE') {
      console.log(oldMsg)
    }
    oldMsg &&
      oldMsg.nonce &&
      this.emit(parseInt(oldMsg.nonce), type, Object.assign({}, oldMsg, msg))
  }

  processingImage(type: MjMsgType, message: MjOriginMessage) {
    const {
      content,
      id,
      attachments,
      flags,
      components,
      nonce,
      timestamp,
      message_reference = {} as MjOriginMessage['message_reference']
    } = message
    const { message_id: parentId } = message_reference
    let msg = this.msgMap.getMsgById(id)
    let parentMsg = this.msgMap.getMsgById(parentId)
    let jobNonce = msg?.nonce || parentMsg?.nonce
    console.log(jobNonce, 'emitNonce')
    if (!jobNonce) return
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
        url,
        content,
        parentId,
        flags,
        components,
        progress,
        timestamp
      })
    )
    this.emitNonce(jobNonce, type, mjMsg)
  }

  emitEmbed(id: string, type: MjMsgType, embed: MjMessage['embed']) {
    const msg = this.msgMap.getMsgById(id)
    if (!msg || !msg.nonce) return
    msg.embed = embed
    this.emitNonce(msg.nonce, type, msg)
  }

  waitReady() {
    return new Promise<MjMessage>((s) => {
      this.once('READY', s)
    })
  }

  waitImageMessage({
    nonce,
    parentId,
    cb
  }: {
    nonce: string
    parentId?: string
    cb?: MessageCallBack
  }) {
    this.msgMap.set(nonce, { id: '', nonce })
    const parentMsg = parentId && this.msgMap.getMsgById(parentId)
    return new Promise<MjMessage>((s, j) => {
      parentMsg &&
        parentMsg.nonce &&
        this.once(parseInt(parentMsg.nonce), (type, msg) => {
          console.log(msg, 'parentMsg')
          cb?.(type, msg)
        })
      this.on(parseInt(nonce), (type, msg) => {
        console.log(msg, 'msg')
        cb?.(type, msg)
        this.msgMap.set(nonce, msg)
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
}
