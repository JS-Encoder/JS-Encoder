import { AppContext, createVNode, reactive, ref, render } from "vue"
import { IMessageInfo, IMessageProps } from "../message-list.interface"
import MessageList from "../message-list.vue"

export default class MessageManagerService {
  private messageList = ref<IMessageInfo[]>([])
  /** message计数 */
  private count: number = 0

  constructor(appContext?: AppContext) {
    this.init(appContext)
  }

  init(appContext?: AppContext) {
    const messageListVNode = createVNode(MessageList, {
      messageList: this.messageList.value,
      onClose: (id: number) => this.remove(id),
    })
    if (appContext) {
      messageListVNode.appContext = appContext
    }

    const messageListWrapperNode = document.createElement("div")
    render(messageListVNode, messageListWrapperNode)

    document.body.appendChild(messageListWrapperNode)
  }

  add(options: IMessageProps) {
    const messageInfo = reactive<IMessageInfo>({
      ...options,
      id: this.count ++,
    })
    this.messageList.value.push(messageInfo)
  }

  remove(messageId: number) {
    const messageIndex = this.messageList.value.findIndex(({ id }) => id === messageId)
    if (messageIndex < 0) { return }
    this.messageList.value.splice(messageIndex, 1)
  }
}