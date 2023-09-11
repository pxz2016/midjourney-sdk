import {
  MidJourney,
  MidJourneyOptions,
  MjMessage,
  MjMsgType
} from 'midjourney-sdk'
import { create } from 'zustand'

export interface IMjStore {
  ins: MidJourney | null
  mapping: Record<MjMessage['id'], MjMessage>
  varyRegionInfo: {
    varyRegionImgBase64: string
    varyRegionCustomId: string
    varyRegionPrompt: string
  }
  openVaryRegion: boolean
  init: (opt: MidJourneyOptions) => Promise<void>
  updateMapping: (
    updater: (mapping: Record<MjMessage['id'], MjMessage>) => void
  ) => void
  setOpenVaryRegion: (openVaryRegion: boolean) => void
  handleMsg: (type: MjMsgType, msg: MjMessage) => void
}

export const useMjStore = create<IMjStore>((set, get) => ({
  ins: null,
  mapping: {},
  varyRegionInfo: {
    varyRegionImgBase64: '',
    varyRegionCustomId: '',
    varyRegionPrompt: ''
  },
  openVaryRegion: false,
  async init(opts) {
    let ins = await new MidJourney(opts).init()
    set(() => ({ ins }))
  },
  setOpenVaryRegion(openVaryRegion) {
    set({ openVaryRegion })
  },
  updateMapping(updater) {
    const mapping = get().mapping
    updater(mapping)
    set({ mapping })
  },
  handleMsg(type, msg) {
    console.log(
      `msgType: ${type}, eventId: ${msg.nonce}, msgId: ${msg.id}, parentId: ${msg.parentId}, originId: ${msg.originId}, progress: ${msg.progress}`
    )
    if (type === 'MESSAGE_DELETE') {
      get().updateMapping((mapping) => {
        delete mapping[msg.id]
      })
    } else if (
      type === 'INTERACTION_IFRAME_MODAL_CREATE' &&
      msg.varyRegionImgBase64 &&
      msg.varyRegionCustomId &&
      msg.varyRegionPrompt
    ) {
      set({
        openVaryRegion: true,
        varyRegionInfo: {
          varyRegionCustomId: msg.varyRegionCustomId,
          varyRegionImgBase64: msg.varyRegionImgBase64,
          varyRegionPrompt: msg.varyRegionPrompt
        }
      })
    } else {
      get().updateMapping((mapping) => {
        mapping[msg.id] = msg
      })
    }
  }
}))
