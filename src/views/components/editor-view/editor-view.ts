import { AreaPosition } from "@type/editor"

export interface IProps {
  splitterId: number
  id: number
}

export interface IEmits {
  (e: "selectSplitPosition", splitPosition: AreaPosition): void
}