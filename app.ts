import { config } from 'dotenv'
config({ path: './.env' })
import { MidJourney, WsEventType } from './src'
import EventEmitter from 'events'
const mj = new MidJourney({
  guild_id: <string>process.env.GUILD_ID,
  token: <string>process.env.TOKEN,
  channel_id: <string>process.env.CHANNEL_ID
})

// mj.ws.on('message', (msg) => {
//   const payload = JSON.parse(msg.toString())
//   const type = payload.t as WsEventType
//   const data = payload.d
//   console.log(type)
// })
// mj.on('message', (msg) => {
//   const payload = JSON.parse(msg.toString())
//   const type = payload.t as WsEventType
//   const data = payload.d
//   switch (type) {
//     case 'READY':
//       console.log(data.user)
//       break
//     case 'MESSAGE_CREATE':
//       console.log(data)
//       break
//     case 'MESSAGE_UPDATE':
//       console.log(data)
//       break
//     case 'INTERACTION_SUCCESS':
//       console.log(data)
//       break
//     case 'INTERACTION_CREATE':
//       console.log(data)
//       break
//   }
// })
// ;(async () => {
//   // wait the ws connection success
//   // setTimeout(async () => {
//   //   await mj
//   //     .submitCustomZoom(
//   //       '1129013890869645372',
//   //       'c3beb1ce-eaee-4309-bdbc-b2e90f888a6a',
//   //       'apple --ar 1:1 --zoom 2'
//   //     )
//   //     .catch((err) => {
//   //       console.log(err)
//   //     })
//   // }, 3000)
// })()
