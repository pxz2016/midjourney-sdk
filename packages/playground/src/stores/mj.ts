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
      varyRegionCustomId: ''
    },
    openIframe: false
  }),
  getters: {
    initialize: ({ ins }) => ins?.initialize
  },
  actions: {
    async init(opts: MidJourneyOptions) {
      let ins = new MidJourney(opts)
      this.ins = await ins.init()
    },
    handleMsg(type: MjMsgType, msg: MjMessage) {
      console.log(
        `消息类型: ${type}, 事件ID: ${msg.nonce}, 消息ID: ${msg.id}, 父级ID: ${msg.parentId}, 原始ID: ${msg.originId}, 进度: ${msg.progress}`
      )
      if (type === 'MESSAGE_DELETE') {
        delete this.mapping[msg.id]
      } else if (type === 'INTERACTION_IFRAME_MODAL_CREATE') {
        // console.log(msg)
        msg.varyRegionImgBase64 &&
          (this.varyRegionInfo.varyRegionImgBase64 = msg.varyRegionImgBase64)
        msg.varyRegionCustomId &&
          (this.varyRegionInfo.varyRegionCustomId = msg.varyRegionCustomId)
        this.openIframe = true
      } else {
        this.mapping[msg.id] = msg
      }
    }
  }
})
