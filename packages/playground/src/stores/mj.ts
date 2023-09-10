import {
  MidJourney,
  MidJourneyOptions,
  MjMessage,
  MjMsgType
} from 'midjourney-sdk'

export const useMjStore = defineStore('midjourney', {
  state: () => ({
    ins: null as MidJourney | null,
    user: null as any,
    mapping: {} as Record<MjMessage['id'], MjMessage>,
    varyRegionInfo: {
      varyRegionImgBase64: '',
      varyRegionCustomId: '',
      varyRegionPrompt: ''
    },
    openVaryRegion: false
  }),
  actions: {
    async init(opts: MidJourneyOptions) {
      let ins = new MidJourney(opts)
      this.ins = await ins.init()
    },
    handleMsg(type: MjMsgType, msg: MjMessage) {
      console.log(
        `msgType: ${type}, eventId: ${msg.nonce}, msgId: ${msg.id}, parentId: ${msg.parentId}, originId: ${msg.originId}, progress: ${msg.progress}`
      )
      if (type === 'MESSAGE_DELETE') {
        delete this.mapping[msg.id]
      } else if (type === 'INTERACTION_IFRAME_MODAL_CREATE') {
        msg.varyRegionImgBase64 &&
          (this.varyRegionInfo.varyRegionImgBase64 = msg.varyRegionImgBase64)
        msg.varyRegionCustomId &&
          (this.varyRegionInfo.varyRegionCustomId = msg.varyRegionCustomId)
        msg.varyRegionPrompt &&
          (this.varyRegionInfo.varyRegionPrompt = msg.varyRegionPrompt)
        this.openVaryRegion = true
      } else {
        this.mapping[msg.id] = msg
      }
    }
  }
})
