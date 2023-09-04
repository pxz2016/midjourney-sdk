import { MjMessage, MjOriginMessage } from './types'

export class MidjourneyMsgMap extends Map<MjOriginMessage['nonce'], MjMessage> {
  updateMsgByNonce(id: string, nonce: string) {
    let msg = this.get(nonce)
    if (!msg) return
    msg.id = id
  }

  getMsgById(id: string) {
    return Array.from(this.entries()).find(([_, v]) => v.id === id)?.[1]
  }

  getMsgByparentId(parentId: string) {
    return Array.from(this.entries()).find(
      ([_, v]) => v.parentId === parentId
    )?.[1]
  }

  delMsgById(id: string) {
    let msg = this.getMsgById(id)
    if (msg) {
      msg.deleted = true
      return msg
    }
  }
}
