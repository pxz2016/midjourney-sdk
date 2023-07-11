import 'dotenv/config'
import { MidJourney } from './src'
const mj = new MidJourney({
  guild_id: <string>process.env.GUILD_ID,
  session_id: <string>process.env.SESSION_ID,
  token: <string>process.env.BOT_TOKEN,
  channel_id: <string>process.env.CHANNEL_ID,
  ws(type, payload) {
    console.log(type, payload)
  }
})
