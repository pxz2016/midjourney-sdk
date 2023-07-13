import { MidJourney } from '../src'
import { config } from 'dotenv'
config({ path: './.env.local' })

const mj = new MidJourney({
  guild_id: <string>process.env.GUILD_ID,
  token: <string>process.env.TOKEN,
  channel_id: <string>process.env.CHANNEL_ID
})

describe('MidJourney Unit Test', () => {
  it('info', (e) => {
    expect(111).toBe(111)
  })
})
