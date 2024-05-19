export interface IProps {
  modelValue: boolean
}

export interface IEmits {
  (event: "update:modelValue", value: boolean): void
}