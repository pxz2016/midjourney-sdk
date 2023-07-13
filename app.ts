import 'dotenv/config'
import { MidJourney, WsEventType } from './src'
const mj = new MidJourney({
  guild_id: <string>process.env.GUILD_ID,
  token: <string>process.env.TOKEN,
  channel_id: <string>process.env.CHANNEL_ID
})

mj.on('message', (msg) => {
  const payload = JSON.parse(msg.toString())
  const type = payload.t as WsEventType
  const data = payload.d
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
;(() => {
  // wait the ws connection success
  setTimeout(async () => {
    await mj.imagine('apple').catch((err) => {
      console.log(err)
    })
  }, 3000)
})()
