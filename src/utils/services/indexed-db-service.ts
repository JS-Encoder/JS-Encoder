/**
 * 对于上一个版本(v3)来说，虽然是纯前端项目，但需要存储的数据量不大，完全可以使用sessionStorage和localStorage来应付。
 * 在v4中新增了可以存储自定义模板的功能，因为无法预知自定义模板的数据大小，所以使用indexedDB更加保险。
 */
import { ErrorCode, throwError } from "@utils/tools/error"
import { deepCopy } from "@utils/tools/common"
import SingleInstance from "@utils/decorators/single-instance"
import { DBStoreName, IDBStoreData } from "@utils/config/indexed-db"
import { IReqRes } from "@utils/tools/request"

export interface DBStoreIndex {
  name: string
  unique: boolean
}

export interface DBStore {
  /** 对象仓库名称 */
  name: string
  /** 主键名称 */
  primaryKey: string
  /** 索引列表 key：索引名称 value：是否可以重复 */
  indexList?: DBStoreIndex[]
  /** 版本更新时是否需要删除原来的仓库 */
  isClear?: boolean
}

export interface IDBConfig {
  /** 数据库名 */
  dbName: string
  /** 对象仓库集合 */
  stores: DBStore[]
  /** 数据库版本 */
  version?: number
  /** 初始化回调 */
  onReady?: () => void
}

export enum DBStatus {
  /** 初始等待 */
  PENDING = "pending",
  /** 连接中 */
  CONNECTING = "connecting",
  /** 已连接 */
  CONNECTED = "connected",
  /** 连接失败 */
  FAILED = "failed",
}

type TransactionMode = "readonly" | "readwrite" | "versionchange"

declare global {
  interface Window {
    webkitDB?: IDBFactory
    mozDB?: IDBFactory
    msDB?: IDBFactory
  }
}

@SingleInstance
export class DBService {
  /** 数据库状态 */
  public status: DBStatus = DBStatus.PENDING
  /** 数据库 */
  private indexedDb?: IDBFactory
  /** 数据库对象 */
  private db: IDBDatabase | null = null
  /** 数据库信息 */
  private readonly dbInfo?: IDBConfig
  /** 数据库请求对象 */
  private readonly dbReq?: IDBOpenDBRequest

  constructor(config?: IDBConfig) {
    const indexedDb =  window.indexedDB || window.webkitDB || window.mozDB || window.msDB
    if (!indexedDb) {
      throwError(ErrorCode.DB_NOT_SUPPORT)
    }
    if (this.status !== DBStatus.PENDING) { return }
    if (!config) {
      throwError(ErrorCode.DB_NO_CONFIG)
      return
    }
    this.indexedDb = indexedDb
    this.dbInfo = config
    this.dbReq = this.open()
  }

  /** 初始化数据库事件回调 */
  public init() {
    this.status = DBStatus.CONNECTING
    const dbReq = this.dbReq!
    dbReq.onblocked = (event) => {
      throwError(ErrorCode.DB_CONNECT_BLOCKED, { data: event })
    }
    dbReq.onupgradeneeded = (event) => {
      const db: IDBDatabase = (event as any).target?.result
      this.dbInfo!.stores.forEach((store) => {
        const { isClear, name } = store
        if (db.objectStoreNames.contains(name)) {
          if (!isClear) { return }
          // 删除旧仓库
          db.deleteObjectStore(name)
        }
        this.createStore(store, db)
      })
    }
    return new Promise<boolean>((resolve, reject) => {
      dbReq.onsuccess = (event) => {
        console.info("数据库连接成功")
        this.status = DBStatus.CONNECTED
        this.db = dbReq.result
        this.dbInfo!.onReady?.()
        resolve(true)
      }
      dbReq.onerror = (event) => {
        this.status = DBStatus.FAILED
        throwError(ErrorCode.DB_CONNECT_FAILED, { data: event })
        reject(false)
      }
    })
  }

  /** 添加单条数据 */
  public add<T extends keyof IDBStoreData>(
    storeName: DBStoreName,
    data: IDBStoreData[T],
  ) {
    return this.setSingleReqCallback<number>(
      () => this.beginTransaction(storeName).add(deepCopy(data)),
      ErrorCode.DB_ADD_SINGLE_FAILED,
      storeName, data,
    )
  }

  /** 获取单条数据 */
  public get<T extends keyof IDBStoreData>(
    storeName: DBStoreName,
    primaryKey: IDBValidKey | IDBKeyRange,
  ) {
    return this.setSingleReqCallback<IDBStoreData[T]>(
      () => this.beginTransaction(storeName).get(primaryKey),
      ErrorCode.DB_GET_SINGLE_FAILED,
      storeName, primaryKey,
    )
  }

  /** 获取所有数据 */
  public getAll<T extends keyof IDBStoreData>(storeName: DBStoreName) {
    return this.setMultipleDataReqCallBack<IDBStoreData[T]>(
      () => this.beginTransaction(storeName).openCursor(),
      ErrorCode.DB_GET_ALL_FAILED,
      storeName,
    )
  }

  /** 通过索引获取数据 */
  public getByIndex<T extends keyof IDBStoreData>(
    storeName: DBStoreName,
    indexName: string,
  ) {
    return this.setMultipleDataReqCallBack<IDBStoreData[T]>(
      () => this.beginTransaction(storeName).index(indexName).openCursor(),
      ErrorCode.DB_GET_BY_INDEX_FAILED,
      storeName, indexName,
    )
  }

  /** 更新数据 */
  public update<T extends keyof IDBStoreData>(
    storeName: DBStoreName,
    data: IDBStoreData[T],
    primaryKey?: IDBValidKey,
  ) {
    return this.setSingleReqCallback<number>(
      () => this.beginTransaction(storeName).put(deepCopy(data), primaryKey),
      ErrorCode.DB_UPDATE_FAILED,
      storeName, data, primaryKey,
    )
  }

  /** 删除数据 */
  public delete(storeName: DBStoreName, primaryKey: IDBValidKey | IDBKeyRange): Promise<any> {
    return this.setSingleReqCallback(
      () => this.beginTransaction(storeName).delete(primaryKey),
      ErrorCode.DB_DELETE_FAILED,
      storeName, primaryKey,
    )
  }

  /** 获取条数 */
  public count(storeName: DBStoreName) {
    return this.setSingleReqCallback<number>(
      () => this.beginTransaction(storeName, "readonly").count(),
      ErrorCode.DB_COUNT_FAILED,
      storeName,
    )
  }

  /** 开启数据库 */
  private open(): IDBOpenDBRequest {
    const { dbName, version } = this.dbInfo!
    return this.indexedDb!.open(dbName, version)
  }

  /** 创建仓库 */
  private createStore(store: DBStore, db: IDBDatabase = this.db!): void {
    const { name, primaryKey, indexList } = store
    const newStore = db.createObjectStore(name, { keyPath: primaryKey, autoIncrement: true })
    indexList?.forEach((index) => {
      const { name: indexName, unique } = index
      newStore.createIndex(indexName, indexName, { unique })
    })
  }

  private beginTransaction(storeName: string, mode: TransactionMode = "readwrite"): IDBObjectStore {
    const transaction = this.db?.transaction(storeName, mode)

    transaction!.onerror = (event) => {
      throwError(ErrorCode.DB_CREATE_TRANSACTION_FAILED, { data: event })
    }
    transaction!.oncomplete = () => {
      console.info("数据库修改结束，事务完成")
    }

    return transaction!.objectStore(storeName)
  }

  private setSingleReqCallback<T>(
    getReq: () => IDBRequest<any>,
    code: ErrorCode,
    ...args: any[]
  ): Promise<IReqRes<T>> {
    return new Promise((resolve, reject) => {
      const req = getReq()
      req.onsuccess = (event) => {
        resolve({ success: true, data: req.result })
      }
      req.onerror = (event) => {
        throwError(code, { data: { ...args, event } })
        reject({ success: false, data: event })
      }
    })
  }

  private setMultipleDataReqCallBack<T>(
    getReq: () => IDBRequest<any>,
    code: ErrorCode,
    ...args: any[]
  ): Promise<IReqRes<T[]>> {
    return new Promise((resolve, reject) => {
      const req = getReq()
      const data: T[] = []
      req.onsuccess = (event) => {
        const result = req.result
        if (result) {
          data.push({ id: result.key, ...result.value })
          result.continue()
        } else {
          resolve({ success: true, data })
        }
      }
      req.onerror = (event) => {
        throwError(code,  { data: { ...args, event } })
        reject({ success: false, data })
      }
    })
  }
}
