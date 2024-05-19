import { ITemplate } from "@type/template"
import { IDBConfig, DBStore } from "@utils/services/indexed-db-service"

export enum DBStoreName {
  /** 模板 */
  TEMPLATE = "template",
}

export interface IDBStoreData {
  /** 存储模板信息的表 */
  [DBStoreName.TEMPLATE]: ITemplateInfo
}

export interface ITemplateInfo extends ITemplate {
  /** id自增 */
  id?: number
}

/** 数据库名 */
export const INDEXED_DB_NAME = "JS-Encoder-DB"
/** 数据库版本 */
export const INDEXED_DB_VERSION = 1
/** 数据库配置 */
export const INDEXED_DB_STORES: DBStore[] = [
  {
    name: "template",
    primaryKey: "id",
    isClear: false,
  },
]

export const dbConfig: IDBConfig = {
  dbName: INDEXED_DB_NAME,
  version: INDEXED_DB_VERSION,
  stores: [
    {
      name: DBStoreName.TEMPLATE,
      primaryKey: "id",
      isClear: false,
    },
  ],
}