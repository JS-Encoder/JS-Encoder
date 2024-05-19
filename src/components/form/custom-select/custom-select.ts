import { Size } from "@type/interface"

export type SelectSize = Exclude<Size, Size.MINI | Size.X_LARGE>

export interface ISelectOption {
  value: string | number | boolean | null | undefined
  label?: string | number
  [key: string]: any
}

export interface IProps {
  /** 内容 */
  modelValue: ISelectOption["value"]
  /** 数据列表, 如果不传label，就直接使用value代替label展示 */
  dataList?: ISelectOption[]
  /** 尺寸 */
  size?: SelectSize
  /** 是否将选择项列表插入到body中 */
  appendToBody?: boolean
  /** 描述文字 */
  placeholder?: string
  /** 是否可以搜索 */
  showSearch?: boolean
  /** 是否禁用 */
  disabled?: boolean
  selectStyle?: string
  optionStyle?: string
  selectInnerStyle?: string
}

export interface IEmits {
  (event: "update:modelValue", state: ISelectOption["value"]): void
  /** 选择了选项之后触发 */
  (event: "selected", state: ISelectOption): void
}