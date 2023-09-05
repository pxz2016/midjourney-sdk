import { MidjourneyCommand } from './command'
import { MessageCallBack, MidJourneyFullOptions } from './types'
import { nextNonce } from './utils'

export class MidjourneyApi extends MidjourneyCommand {
  constructor(public opts: MidJourneyFullOptions) {
    super(opts)
  }

  private async interactions(payload: any) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: this.opts.token
    }
    return this.opts.fetch(`${this.opts.apiBaseUrl}/api/v9/interactions`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers
    })
  }

  private getPayload(
    type: number,
    data: any,
    others: any = {},
    nonce = nextNonce()
  ) {
    if (!this.opts.session_id && this.opts.initialize !== 'initialized') {
      throw new Error('please invoke `init` method before every operate')
    }
    return Object.assign(
      {
        type,
        application_id: '936929561302675456',
        guild_id: this.opts.guild_id,
        channel_id: this.opts.channel_id,
        session_id: this.opts.session_id,
        nonce,
        data
      },
      others
    )
  }

  async imagine(value: string, cb?: MessageCallBack) {
    return this.getCommand('imagine').then((command) => {
      const payload = this.getPayload(
        2,
        Object.assign(command!, {
          options: [{ ...command?.options[0], value }]
        })
      )
      return Promise.all([
        this.interactions(payload),
        this.opts.ws?.waitMessage({ nonce: payload.nonce, cb, prompt: value })
      ]).then(([_, res]) => res)
    })
  }

  // async imagine(value: string, cb?: MessageCallBack) {
  //   const nonce = nextNonce()
  //   value = `nonce: ${nonce}, ${value}`
  //   return this.getCommand('imagine').then((command) => {
  //     const payload = this.getPayload(
  //       2,
  //       Object.assign(command!, {
  //         options: [{ ...command?.options[0], value }]
  //       }),
  //       {},
  //       nonce
  //     )
  //     return Promise.all([
  //       this.interactions(payload),
  //       this.opts.ws?.waitMessage({ nonce: payload.nonce, cb })
  //     ]).then(([_, res]) => res)
  //   })
  // }

  action(
    message_id: string,
    custom_id: string,
    message_flags: number,
    cb?: MessageCallBack
  ) {
    const payload = this.getPayload(
      3,
      {
        component_type: 2,
        custom_id
      },
      {
        message_flags,
        message_id
      }
    )
    return Promise.all([
      this.interactions(payload),
      this.opts.ws?.waitMessage({
        nonce: payload.nonce,
        cb,
        parentId: message_id
      })
    ]).then(([_, res]) => res)
  }

  info(cb?: MessageCallBack) {
    return this.getCommand('info').then((command) => {
      const payload = this.getPayload(2, command)
      return Promise.all([
        this.interactions(payload),
        this.opts.ws?.waitMessage({ nonce: payload.nonce, cb })
      ]).then(([_, msg]) => msg)
    })
  }

  settings(cb?: MessageCallBack) {
    return this.getCommand('settings').then((command) => {
      const payload = this.getPayload(2, command)
      return Promise.all([
        this.interactions(payload),
        this.opts.ws?.waitMessage({ nonce: payload.nonce, cb })
      ]).then(([_, msg]) => msg)
    })
  }

  fast(cb?: MessageCallBack) {
    return this.getCommand('fast').then((command) => {
      const payload = this.getPayload(2, command)
      return Promise.all([
        this.interactions(payload),
        this.opts.ws?.waitMessage({ nonce: payload.nonce, cb })
      ]).then(([_, msg]) => msg)
    })
  }

  relax(cb?: MessageCallBack) {
    return this.getCommand('relax').then((command) => {
      const payload = this.getPayload(2, command)
      return Promise.all([
        this.interactions(payload),
        this.opts.ws?.waitMessage({ nonce: payload.nonce, cb })
      ]).then(([_, msg]) => msg)
    })
  }
}
