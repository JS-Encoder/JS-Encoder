export interface IMessageListProps {
  messageList: IMessageInfo[]
}

export interface IMessageListEmits {
  (event: "close", value: number): void
}

export interface IMessageProps {
  text: string
  type?: MessageType
  duration?: number
  customStyle?: { [key: string]: any }
}

export interface IMessageEmits {
  (event: "close"): void
}

export interface IMessageInfo extends IMessageProps {
  id: number
}

export enum MessageType {
  NOTICE = "notice",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
}