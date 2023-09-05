import EventEmitter from 'eventemitter3'
import WebSocket from 'isomorphic-ws'
import {
  MessageCallBack,
  MidJourneyFullOptions,
  MjEvents,
  MjMessage,
  MjMsgType,
  MjOriginMessage
} from './types'
import { MidjourneyMsgMap } from './msgMap'

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
      this.emit('WS_ERROR', err.message)
      this.opts.debug?.(
        'MidjourneyWs',
        '#connect'
      )(`discord ws occurred an error: ${err.message}`)
      this.#ws.close()
    })
    ws.addEventListener('close', ({ code, reason }) => {
      this.emit('WS_CLOSE')
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
    const type = payload.t as string
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
      console.log(data);
      // this.handleMessage(type, data)
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
    const { nonce, id, embeds } = message
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
    this.emitNonce(id, 'MESSAGE_DELETE', { id }, true)
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
    let msg = this.msgMap.getMsgById(id) || this.msgMap.getMsgById(parentId)
    console.log(msg, 'msg', message)
    if (!msg?.nonce) return
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
    const originId = msg.id !== id ? msg.id : undefined
    const mjMsg = JSON.parse(
      JSON.stringify({
        id,
        url,
        originId,
        content,
        parentId: originId ? undefined : msg?.originId ? undefined : parentId,
        flags,
        components,
        progress,
        timestamp
      })
    )
    // console.log(mjMsg, 'originId')
    // if (parentId) {
    //   let test1 = this.msgMap.getMsgByparentId(parentId)
    //   if (test1 && test1.id !== id) {
    //     console.log(test1)
    //     this.msgMap.set(test1.nonce, mjMsg)
    //   }
    // }
    this.emitNonce(msg.nonce, type, mjMsg)
  }

  emitNonce(idOrNonce: string, type: MjMsgType, msg: MjMessage, isDel = false) {
    const emitMsg =
      this.msgMap.get(idOrNonce) ||
      this.msgMap.getMsgById(idOrNonce) ||
      this.msgMap.getMsgByOriginId(idOrNonce)
    emitMsg &&
      emitMsg.nonce &&
      this.emit(
        emitMsg.nonce,
        type,
        isDel ? msg : Object.assign({}, emitMsg, msg)
      )
  }

  emitEmbed(id: string, type: MjMsgType, embed: MjMessage['embed']) {
    const msg = this.msgMap.getMsgById(id)
    if (!msg || !msg.nonce) return
    msg.embed = embed
    this.emitNonce(msg.nonce, type, msg)
  }

  waitReady() {
    return new Promise<MjOriginMessage['user']>((s) => {
      this.once('READY', s)
    })
  }

  waitMessage({
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
        this.on(parentMsg.nonce, (type, msg) => {
          // console.log(msg, 'parentMsg')
          cb?.(type, msg)
          if (msg.id != parentMsg.id) {
            console.log(msg, 'parentMsg off')
            this.off(parentMsg.nonce!)
          } else {
            this.msgMap.set(msg.nonce, msg)
          }
        })
      this.on(nonce, (type, msg) => {
        cb?.(type, msg)
        if (type === 'MESSAGE_DELETE' && msg.id) {
          const final = this.msgMap.getMsgByOriginId(msg.id)
          final && this.off(nonce) && s(final)
          return
        }
        this.msgMap.set(nonce, msg)
        if (msg.error) {
          this.off(nonce)
          j(msg.error)
          return
        }
      })
    })
  }
}
