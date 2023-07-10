import DiscordRequest from './http'
import { MidJourneyOptions } from './types'
export class MidJourney {
  private request: DiscordRequest
  private guild_id: string
  private session_id: string
  private channel_id: string
  private imagine_version: string = '1118961510123847772'

  constructor(options: MidJourneyOptions) {
    let { guild_id, session_id, channel_id, token, version, imagine_version } =
      options || {}
    if (!guild_id) throw new Error('guild_id is required')
    if (!session_id) throw new Error('session_id is required')
    if (!channel_id) throw new Error('channel_id is required')
    if (!token) throw new Error('token is required')
    this.guild_id = guild_id
    this.session_id = session_id
    this.channel_id = channel_id
    imagine_version && (this.imagine_version = imagine_version)
    this.request = new DiscordRequest(token, version)
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

  interactions(payload: any) {
    return this.request.post('/interactions', payload)
  }

  generate(value: string) {
    const payload = this.#getPayload(2, {
      version: this.imagine_version,
      id: '938956540159881230',
      name: 'imagine',
      type: 1,
      options: [
        {
          type: 3,
          name: 'prompt',
          value
        }
      ]
    })
    return this.interactions(payload)
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
    return this.interactions(payload)
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
    return this.interactions(payload)
  }

  reset(msg_id: string, msg_hash: string) {
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
    return this.interactions(payload)
  }
}
