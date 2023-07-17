import { config } from 'dotenv'
config({ path: './.env' })
import { MidJourney, WsEventType } from './src'

const mj = new MidJourney({
  guild_id: <string>process.env.GUILD_ID,
  token: <string>process.env.TOKEN,
  channel_id: <string>process.env.CHANNEL_ID,
  debug: true
})

mj.on('message', (msg) => {
  const type = msg.t as WsEventType
  const data = msg.d
  switch (type) {
    case 'READY':
      console.log(data.user)
      break
    case 'MESSAGE_CREATE':
      console.log(data)
      break
    case 'MESSAGE_UPDATE':
      console.log(data)
      break
    case 'INTERACTION_SUCCESS':
      console.log(data)
      break
    case 'INTERACTION_CREATE':
      console.log(data)
      break
  }
})
;(async () => {
  // wait the ws connection success
  setTimeout(async () => {
    await mj.imagine('ferrari --q 5 --ar 16:9')
  }, 3000)
})()
