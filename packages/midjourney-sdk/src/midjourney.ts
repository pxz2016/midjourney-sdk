import { MidjourneyApi } from './api'
import { defaultOpts } from './config'
import { MidJourneyFullOptions, MidJourneyOptions } from './types'
import { MidjourneyWs } from './ws'

export class MidJourney {
  public api: MidjourneyApi
  opts: MidJourneyFullOptions
  constructor(opts: MidJourneyOptions) {
    if (!opts.token || !opts.channel_id || !opts.guild_id) {
      throw new Error('`token`、`channel_id` and `guild_id` are required')
    }
    this.opts = Object.assign(defaultOpts, opts, {
      initialize: 'not_initialized',
      discordsaysUrl:
        typeof document === 'undefined'
          ? 'https://936929561302675456.discordsays.com'
          : ''
    }) as MidJourneyFullOptions
    if (!this.opts.apiBaseUrl) throw new Error("apiBaseUrl can't be empty")
    if (!this.opts.wsBaseUrl) throw new Error("wsBaseUrl can't be empty")
    this.api = new MidjourneyApi(this.opts)
  }

  init() {
    return new Promise<MidJourney>(async (s) => {
      this.opts.initialize = 'initializing'
      this.opts.ws = new MidjourneyWs(this.opts)
      await this.opts.ws.waitReady()
      this.opts.initialize = 'initialized'
      s(this)
    })
  }
}
