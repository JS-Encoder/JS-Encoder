import { Position, Trigger } from "@type/interface"

export interface IProps {
  /** 提示展示位置 */
  position?: Position
  /** 偏移量，单位px */
  offset?: number | string
  /** 是否显示小三角 */
  showTriangle?: boolean
  /** 是否挂载在body中，在一些父元素设置over-flow:hidden的情况下可能会导致popover显示不全，放在body中可解决 */
  appendToBody?: boolean
  /** 层级，对应z-index */
  level?: string
  /** 触发显示的行为 */
  trigger?: Trigger
  /** 延迟消失时间，单位ms */
  delay?: number
}