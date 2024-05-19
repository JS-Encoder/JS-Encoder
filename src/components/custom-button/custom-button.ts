import { BtnType, Size } from "@type/interface"

export interface IProps {
  /** 按钮尺寸 mini|small|medium|large|xLarge */
  size?: Size | string
  /** 是否禁用 */
  disabled?: boolean
  /** 是否只显示icon没有文字 */
  icon?: boolean
  /** icon类名 */
  iconClass?: string
  /** 按钮类型 */
  type?: BtnType | string
  /** 是否显示icon */
  showIcon?: boolean
  /** 是否有阴影 */
  shadow?: boolean
  /** 是否有外边框 */
  outline?: boolean
  /** 是否正在加载 */
  loading?: boolean
  /** 是否为全圆角按钮 */
  radius?: boolean
  /** 是否占满一整行 */
  fill?: boolean
  /** 自定义样式类名 */
  customClass?: string
}

export interface IEmits {
  (e: "click"): void
}