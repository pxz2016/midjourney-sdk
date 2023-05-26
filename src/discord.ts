import { Client, ClientOptions, GatewayIntentBits } from 'discord.js'
import { ProxyAgent } from 'undici'
// export default new Client({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.MessageContent,
//     GatewayIntentBits.GuildMessages,
//   ],
//   rest: {
//     agent: new ProxyAgent("http://127.0.0.1:7890"),
//   },
// });

export default class {
  client: Client
  constructor(token: string, options?: ClientOptions) {
    this.client = new Client(
      Object.assign(
        {
          intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages
          ]
        },
        options
      )
    )
    this.client.login(token)
  }
}
