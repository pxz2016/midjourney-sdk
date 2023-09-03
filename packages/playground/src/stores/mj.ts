import { MidJourney } from 'midjourney-sdk'

export const ins = new MidJourney({
  token: import.meta.env.VITE_TOKEN,
  guild_id: import.meta.env.VITE_GUILD_ID,
  channel_id: import.meta.env.VITE_CHANNEL_ID,
  apiBaseUrl: 'https://proxy.atjia.com/proxy/discord',
  imgBaseUrl: 'https://proxy.atjia.com/proxy/discordapp',
  wsBaseUrl: 'wss://proxy.atjia.com/proxy/discordWs?encoding=json&v=9'
})

export const useMjStore = defineStore('midjourney', {
  state: () => ({
    ins,
    user: ''
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    }
  }
})
