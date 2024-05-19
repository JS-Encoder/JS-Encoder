import { Size } from "@type/interface"

export type InputSize = Exclude<Size, Size.MINI | Size.X_LARGE>

export enum InputType {
  /** 文本 */
  TEXT = "text",
  /** 数字 */
  NUMBER = "number",
  /** 文本区 */
  TEXTAREA = "textarea",
}

export interface IProps {
  /** 内容 */
  modelValue?: string | number | undefined
  /** 是否禁用 */
  disabled?: boolean
  /** input类型 */
  type?: InputType
  /** 描述文字 */
  placeholder?: string
  /** input自定义class */
  inputClass?: string
  /** 尺寸 */
  size?: InputSize
  /** 最大长度 */
  maxLength?: number
  /** 宽度 */
  width?: string
  /** 圆角 */
  radius?: number

  /** number input 特有属性 */
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number

  /** textarea 特有属性 */
  /** 最小行数 */
  minRows?: number
  /** 最大行数 */
  maxRows?: number
  /** 是否可以自由改变尺寸 */
  resize?: boolean
}

export interface IEmits {
  (event: "update:modelValue", state: string | number): void
  (event: "focus" | "blur"): void
}