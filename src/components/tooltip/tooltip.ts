import { Position } from "@type/interface"

export interface IProps {
  /** 提示文字，如果使用slot#content则忽略此属性 */
  content?: string
  /** 提示展示位置 */
  position?: Position
  /** 偏移量，单位px */
  offset?: number | string
  /** 延迟消失时间，单位ms */
  delay?: number
  /** 是否禁用 */
  disable?: boolean
  /** 是否显示小三角 */
  showTriangle?: boolean
  /** 是否消失 */
  hidden?: boolean
  /** 层级，对应z-index */
  level?: string
}