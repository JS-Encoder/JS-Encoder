export type DeepPartial<T> = T extends object
  ? { [U in keyof T]?: DeepPartial<T[U]> }
  : T

// https://github.com/microsoft/TypeScript/issues/29729#issuecomment-700527227
export type LiteralUnion<T extends U, U = string> =
  | T
  | (Pick<U, never> & { _?: never | undefined })

/** 包含特定属性以及其他任意属性的对象 */
export type FreeRecord<T> = T extends object
  ? { [U in keyof T]: T[U] } & { [key: string]: any }
  : T