import MidjourneyCommand from './command'
import { MidJourneyOptions } from './types'
export class MidJourney extends MidjourneyCommand {
  private guild_id: string
  private session_id: string

  constructor(options: MidJourneyOptions) {
    let { guild_id, session_id, channel_id, token } = options || {}
    if (!guild_id) throw new Error('guild_id is required')
    if (!session_id) throw new Error('session_id is required')
    if (!token) throw new Error('token is required')
    super(options)
    this.guild_id = guild_id
    this.session_id = session_id
  }

  #getPayload(type: number, data: any, others: any = {}) {
    return Object.assign(
      {
        type,
        application_id: '936929561302675456',
        guild_id: this.guild_id,
        channel_id: this.channel_id,
        session_id: this.session_id,
        data
      },
      others
    )
  }

  #interactions(payload: any) {
    return this.request.post('/interactions', payload)
  }

  async imagine(value: string) {
    const imagine = await this.commands('imagine')
    const payload = this.#getPayload(
      2,
      Object.assign(imagine!, { options: [{ ...imagine?.options[0], value }] })
    )
    return this.#interactions(payload)
  }

  upscale(index: number, msg_id: string, msg_hash: string) {
    const payload = this.#getPayload(
      3,
      {
        component_type: 2,
        custom_id: `MJ::JOB::upsample::${index}::${msg_hash}`
      },
      {
        message_flags: 0,
        message_id: msg_id
      }
    )
    return this.#interactions(payload)
  }

  variation(index: number, msg_id: string, msg_hash: string) {
    const payload = this.#getPayload(
      3,
      {
        component_type: 2,
        custom_id: `MJ::JOB::variation::${index}::${msg_hash}`
      },
      {
        message_flags: 0,
        message_id: msg_id
      }
    )
    return this.#interactions(payload)
  }

  reroll(msg_id: string, msg_hash: string) {
    const payload = this.#getPayload(
      3,
      {
        component_type: 2,
        custom_id: `MJ::JOB::reroll::0::${msg_hash}::SOLO`
      },
      {
        message_flags: 0,
        message_id: msg_id
      }
    )
    return this.#interactions(payload)
  }

  info() {
    return this.commands('info').then((command) =>
      this.#interactions(this.#getPayload(2, command))
    )
  }

  settings() {
    return this.commands('settings').then((command) =>
      this.#interactions(this.#getPayload(2, command))
    )
  }

  fast() {
    return this.commands('fast').then((command) =>
      this.#interactions(this.#getPayload(2, command))
    )
  }

  relax() {
    return this.commands('relax').then((command) =>
      this.#interactions(this.#getPayload(2, command))
    )
  }
}
