import { MjMessage } from './types'

export class MidjourneyMsgMap extends Map<MjMessage['nonce'], MjMessage> {
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

  getMsgByOriginId(originId: string) {
    return Array.from(this.entries()).find(
      ([_, v]) => v.originId === originId
    )?.[1]
  }

  getMsgByContent(content: string, progress = 93) {
    const RE = /\*\*(.+?)\*\*/
    const match = content?.match(RE)
    return Array.from(this.entries()).find(
      ([_, v]) => match && match[1] === v.prompt
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
