import { ILocalStorageData, ISessionStorageData } from "@utils/config/storage"
import { safeJSONParse } from "@utils/tools/common"
import { isNull } from "./judge"

export function setLocalStorage<T extends keyof ILocalStorageData>(
  key: T,
  val: ILocalStorageData[T],
) {
  localStorage.setItem(key, JSON.stringify(val))
}

export function getLocalStorage<T extends keyof ILocalStorageData>(key: T) {
  const data = localStorage.getItem(key)
  return isNull(data) ? data as null : safeJSONParse<ILocalStorageData[T]>(data!)
}

export function setSessionStorage<T extends keyof ISessionStorageData>(
  key: T,
  val: ISessionStorageData[T],
) {
  sessionStorage.setItem(key, JSON.stringify(val))
}

export function getSessionStorage<T extends keyof ISessionStorageData>(key: T) {
  const data = sessionStorage.getItem(key)
  return isNull(data) ? data : safeJSONParse<ISessionStorageData[T]>(data!)
}