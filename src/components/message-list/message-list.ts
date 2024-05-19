import { AppContext } from "vue"
import { IMessageProps, MessageType } from "./message-list.interface"
import MessageManagerService from "./services/message-manager-service"

type MessageApi = (options: IMessageProps | string, app?: AppContext) => void

const apiNameList = [
  "notice",
  "error",
  "success",
  "warning",
]

const getFormatOptions = (options: IMessageProps | string): IMessageProps => {
  return typeof options === "string" ? { text: options } : options
}

let messageManagerService: MessageManagerService | null = null
const messageApiMap = apiNameList.reduce((acc, apiName) => {
  acc[apiName as MessageType] = (options, app) => {
    const formatOptions = getFormatOptions(options)
    if (!messageManagerService) {
      messageManagerService = new MessageManagerService(app)
    }
    return messageManagerService.add({
      ...formatOptions,
      type: apiName as MessageType,
    })
  }
  return acc
}, {} as Record<MessageType, MessageApi>)

export default messageApiMap