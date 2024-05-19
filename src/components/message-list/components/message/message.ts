import { MessageType } from "@components/message-list/message-list.interface"

export const messageType2InfoMap = {
  [MessageType.NOTICE]: { icon: "icon-message-notice", color: "var(--color-primary2)" },
  [MessageType.WARNING]: { icon: "icon-message-warning", color: "var(--color-amber2)" },
  [MessageType.ERROR]: { icon: "icon-message-error", color: "var(--color-red2)" },
  [MessageType.SUCCESS]: { icon: "icon-message-success", color: "var(--color-green2)" },
}