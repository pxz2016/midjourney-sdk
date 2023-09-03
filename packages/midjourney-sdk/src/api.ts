import { MidjourneyCommand } from './command'
import { MidJourneyFullOptions } from './types'
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

  private getPayload(type: number, data: any, others: any = {}, nonce = nextNonce()) {
    if (!this.opts.session_id) {
      throw new Error('session_id is undefined')
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

  async imagine(value: string) {
    return this.getCommand('imagine').then((command) =>
      this.interactions(
        this.getPayload(
          2,
          Object.assign(command!, {
            options: [{ ...command?.options[0], value }]
          })
        )
      )
    )
  }

  action(message_id: string, custom_id: string, message_flags: number) {
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
    return this.interactions(payload)
  }

  info() {
    return this.getCommand('info').then((command) =>
      this.interactions(this.getPayload(2, command))
    )
  }

  settings() {
    return this.getCommand('settings').then((command) =>
      this.interactions(this.getPayload(2, command))
    )
  }

  fast() {
    return this.getCommand('fast').then((command) =>
      this.interactions(this.getPayload(2, command))
    )
  }

  relax() {
    return this.getCommand('relax').then((command) =>
      this.interactions(this.getPayload(2, command))
    )
  }
}
