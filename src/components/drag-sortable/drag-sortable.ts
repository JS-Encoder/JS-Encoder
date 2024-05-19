import { AnyArray } from "@type/interface"

export interface IProps {
  modelValue: AnyArray
  /** 列表遍历和插槽需要用到的key */
  uniqueKey: string
  group?: string
  /** 是否禁止拖拽 */
  disabled: boolean
}

export interface IEmits {
  (event: "update:modelValue", value: AnyArray): void
}