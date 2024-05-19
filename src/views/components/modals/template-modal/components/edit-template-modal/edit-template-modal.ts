import { ITemplateInfo } from "@utils/config/indexed-db"

export interface IProps {
  /** 是编辑还是创建 */
  isEdit?: boolean
  template?: ITemplateInfo
  confirmLoading?: boolean
}

export interface IEmits {
  (event: "confirm", value: IEditTemplateForm): void
  (event: "cancel"): void
}

export interface IEditTemplateForm {
  name: string
}