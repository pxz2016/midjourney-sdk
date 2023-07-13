import 'dotenv/config'
import { MidJourney } from './src'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { resolve } from 'path'
const mj = new MidJourney({
  guild_id: <string>process.env.GUILD_ID,
  channel_id: <string>process.env.CHANNEL_ID,
  token: <string>process.env.USER_TOKEN,
  ws(type, payload) {
    console.log(type, payload)
    // const root = fileURLToPath(import.meta.url)
    // const r = (p: string) => resolve(root, '..', p)
    // fs.writeFileSync(r('./text'), JSON.stringify(payload))
  }
})
;(async () => {
  console.log(process.env.BOT_TOKEN)
  await mj.login(process.env.BOT_TOKEN)
  mj.on('ready', () => {
    console.log('ready')
  })
  mj.on('interactionCreate', (msg) => {
    console.log(msg)
  })
  mj.on('messageCreate', (msg) => {
    console.log(msg)
  })
  // let res = await mj.imagine('apple').catch((err) => {
  //   console.log(err)
  // })
})()
