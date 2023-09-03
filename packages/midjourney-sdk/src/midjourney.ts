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
      initialize: 'not_initialized'
    }) as MidJourneyFullOptions
    this.api = new MidjourneyApi(this.opts)
  }

  init() {
    return new Promise<MidJourney>(async (s) => {
      this.opts.initialize = 'initializing'
      this.opts.ws = new MidjourneyWs(this.opts)
      await this.opts.ws.waitReady()
      const settings = await this.api.settings()
      if (
        settings?.components?.find((v) => v.label === 'Remix mode')?.style === 3
      ) {
        this.opts.remix = true
      } else {
        this.opts.remix = false
      }
      this.opts.initialize = 'initialized'
      s(this)
    })
  }
}
