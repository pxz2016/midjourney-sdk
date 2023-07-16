import MidjourneyCommand from './command'
import { MidJourneyOptions } from './types'

export class MidJourney extends MidjourneyCommand {
  private guild_id: string

  constructor(options: MidJourneyOptions) {
    let { guild_id } = options || {}
    if (!guild_id) throw new Error('guild_id is required')
    super(options)
    this.guild_id = guild_id
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
    return this.commands('imagine').then((command) =>
      this.#interactions(
        this.#getPayload(
          2,
          Object.assign(command!, {
            options: [{ ...command?.options[0], value }]
          })
        )
      )
    )
  }

  action(msg_id: string, custom_id: string) {
    const payload = this.#getPayload(
      3,
      {
        component_type: 2,
        custom_id
      },
      {
        message_flags: 0,
        message_id: msg_id
      }
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

  zoomOut(size: 50 | 75, msg_id: string, msg_hash: string) {
    const payload = this.#getPayload(
      3,
      {
        component_type: 2,
        custom_id: `MJ::Outpaint::${size}::1::${msg_hash}::SOLO`
      },
      {
        message_flags: 0,
        message_id: msg_id
      }
    )
    return this.#interactions(payload)
  }

  // open the dialog width `Zoom Out`
  customZoom(msg_id: string, msg_hash: string) {
    const payload = this.#getPayload(
      3,
      {
        component_type: 2,
        custom_id: `MJ::CustomZoom::${msg_hash}`
      },
      {
        message_flags: 0,
        message_id: msg_id
      }
    )
    return this.#interactions(payload)
  }

  // this msg_id is not id by the photo，that is dialog message id，you can get with `ws` option to listen ws event `INTERACTION_CREATE` or `INTERACTION_SUCCESS` payload
  submitCustomZoom(msg_id: string, msg_hash: string, value: string) {
    const payload = this.#getPayload(5, {
      id: msg_id,
      custom_id: `MJ::OutpaintCustomZoomModal::${msg_hash}`,
      components: [
        {
          type: 1,
          components: [
            {
              type: 4,
              custom_id: 'MJ::OutpaintCustomZoomModal::prompt',
              value
            }
          ]
        }
      ]
    })
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
