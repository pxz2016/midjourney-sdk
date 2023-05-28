import { MidJourney } from '../dist/index.cjs'
import { Client, GatewayIntentBits } from 'discord.js'
import { ProxyAgent } from 'undici'
import Express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const config = {
  guild_id: process.env.GUILD_ID,
  session_id: process.env.SESSION_ID,
  token: process.env.USER_TOKEN
}
const server = Express()
const mj = new MidJourney(config)
const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages
  ]
  //   rest: {
  //     agent: new ProxyAgent('http://127.0.0.1:7890')  如果要vpn网络代理的话， 输入代理地址:端口
  //   }
})
discord.on('ready', () => {
  console.log('discord服务器连接成功')
})

discord.on('messageCreate', async (msg) => {
  console.log(msg.id, msg.type, 'messageCreate')
  // do something
})

discord.on('messageUpdate', async (msg) => {
  console.log(msg.id, msg.type, 'messageUpdate')
  // do something
})

discord.on('messageDelete', async (msg) => {
  console.log(msg.id, msg.type, 'messageDelete')
  // do something
})

server.get('/createGuildChannel/:name', async (req, res) => {
  let result = await mj.createGuildChannel(req.params.name)
  res.send(result)
})

server.get('/getChannelMessages/:channelId', async (req, res) => {
  let result = await mj.getChannelMessages(req.params.channelId)
  res.send(result)
})

server.get('/getGuildChannels', async (req, res) => {
  let result = await mj.getGuildChannels()
  res.send(result)
})

server.post('/prompt', async (req, res) => {
  let { channel_id, value } = req.body
  let result = await mj.prompt(value, false, channel_id)
  res.send(result)
})

server.get('/action/:name', async (req, res) => {
  let { channel_id, msg_id, custom_id } = req.body
  let result = await mj.action(msg_id, custom_id, channel_id)
  res.send(result)
})

server.listen(3000, async () => {
  await discord.login(process.env.BOT_TOKEN)
  console.log('listen on http://localhost:3000')
})
