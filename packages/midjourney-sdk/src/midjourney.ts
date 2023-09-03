import { MidjourneyApi } from './api'
import { defaultOpts } from './config'
import { MidJourneyFullOptions, MidJourneyOptions } from './types'
import { MidjourneyWs } from './ws'

export class MidJourney extends MidjourneyWs {
  public api: MidjourneyApi
  opts: MidJourneyFullOptions
  constructor(opts: MidJourneyOptions) {
    if (!opts.token || !opts.channel_id || !opts.guild_id) {
      throw new Error('`token`、`channel_id` and `guild_id` are required')
    }
    const config = Object.assign(defaultOpts, opts) as MidJourneyFullOptions
    super(config)
    this.opts = config
    this.api = new MidjourneyApi(this.opts)
  }
}
