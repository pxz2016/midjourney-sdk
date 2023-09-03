import { MidJourney, MidJourneyOptions, MjMessage } from 'midjourney-sdk'

export const useMjStore = defineStore('midjourney', {
  state: () => ({
    ins: null as MidJourney | null,
    user: null as any,
    mapping: {} as Record<MjMessage['id'], MjMessage>
  }),
  getters: {
    remix: ({ ins }) => (ins?.opts.remix ? 'yes' : 'no'),
    user: ({ ins }) => ins?.opts.user,
    initialized: ({ ins }) => ins?.opts.initialize === 'initialized'
  },
  actions: {
    init(opts: MidJourneyOptions) {
      this.ins = new MidJourney({
        ...opts,
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
        imgBaseUrl: import.meta.env.VITE_IMG_BASE_URL,
        wsBaseUrl: import.meta.env.VITE_WS_BASE_URL,
        skipHeartbeat: true
      })
      return this.ins.init()
    }
  }
})
