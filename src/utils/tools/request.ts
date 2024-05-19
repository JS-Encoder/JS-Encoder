export interface IReqRes<T = any> {
  success: boolean
  data?: T
}

/** 封装fetch防止404，500等状态码不会触发错误 */
export const safeFetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => {
  return fetch(input, init)
    .then((res) => {
      // code: 2xx
      if (res.ok) {
        return res
      } else {
        throw new Error("Not 2xx response", { cause: res })
      }
    })
}

export const processReqState = <T>(req: Promise<T>): Promise<IReqRes<T>> => {
  return req
    .then((data) => ({ success: true, data }))
    .catch((err) => {
      console.error(err)
      return { success: false }
    })
}