import type { IProps as IButtonProps } from "@components/custom-button/custom-button"

export interface IProps {
  /** 是否显示 */
  modelValue?: boolean
  /** 标题 */
  title?: string
  /** 是否点击esc关闭 */
  escCloseable?: boolean
  /** 点击遮罩层关闭 */
  maskClosable?: boolean
  /** 距离顶部距离 */
  top?: number | string
  /** 距离底部距离 */
  bottom?: number | string
  /** modal宽度 */
  width?: number | string
  /** 是否显示关闭按钮 */
  showClose?: boolean

  /**
   * 底部按钮相关属性
   */
  /** 取消按钮属性 */
  cancelBtnOpts?: IButtonProps
  /** 确认按钮属性 */
  confirmBtnOpts?: IButtonProps
  /** 确认按钮的文本 */
  okText?: string
  /** 是否显示取消按钮 */
  showCancel?: boolean
  /** 取消按钮文字 */
  cancelText?: string
  /** 是否显示底部 */
  showFooter?: boolean
}

export interface IEmits {
  (event: "update:modelValue", state: boolean): void
  (event: "confirm" | "cancel" | "close"): void
}