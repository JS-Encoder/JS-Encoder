import { IReqRes, processReqState, safeFetch } from "@utils/tools/request"
import { GITHUB_LATEST_RELEASE_URL, GITHUB_RELEASES_URL } from "@utils/tools/config"
import { formatDateTime } from "@utils/tools/date"

/** 更新分类标题，参照.github/release-drafter.yml文件(只取需要展示出来的分类） */
export enum CategoryTitle {
  FEATURES = "New Features",
  ENHANCEMENTS = "Enhancements",
  BUGFIX = "Bugfix",
}
const categoryTitles = [
  CategoryTitle.FEATURES,
  CategoryTitle.ENHANCEMENTS,
  CategoryTitle.BUGFIX,
]

export interface IOriginGithubRelease {
  draft: boolean
  prerelease: boolean
  tag_name: string
  body: string
  published_at: string
  html_url: string
}

export interface IUpdateCategory {
  title: CategoryTitle
  logs: string[]
}

export interface IRelease {
  version: string
  publishTime: string
  url: string
  updateCategories: IUpdateCategory[]
}

// eslint-disable-next-line max-lines-per-function
const useUpdateLogs = () => {
  /**
   * 解析markdown代码的内容，获取每个分类下面的列表项
   * 注意：解析规则参照.github/release-drafter.yml文件
   */
  const getUpdateCategories = (content: string): IUpdateCategory[] => {
    const list = content.split("\r\n").filter((str) => !!str)
    const categoryListMap = categoryTitles.reduce((acc, title) => {
      return { ...acc, [title]: [] }
    }, {} as Record<CategoryTitle, string[]>)
    let currTitle: CategoryTitle | null
    list.forEach((str) => {
      // 判断是否为分类标题
      if (/^#{3} /.test(str)) {
        const categoryTitle = categoryTitles.find((title) => title === str.replace(/^#{3} /, ""))
        currTitle = categoryTitle ? categoryTitle : null
      } else if (currTitle) {
        // 判断是否为列表项 匹配修改内容*/- (matchStr) (#num) @xxx
        const detail = str.match(/^[\*|-] (.+) \(#\d+\)/)?.[1]
        if (detail) {
          categoryListMap[currTitle].push(detail)
        }
      }
    })
    // 过滤掉空分类列表
    return categoryTitles
      .filter((title) => !!categoryListMap[title].length)
      .map((title) => ({ title, logs: categoryListMap[title] }))
  }

  const formatUpdateLog = (release: IOriginGithubRelease): IRelease => {
    const { tag_name: version, body: content, published_at: publishTime, html_url: url } = release
    return {
      version, url,
      publishTime: formatDateTime(new Date(publishTime)),
      updateCategories: getUpdateCategories(content),
    }
  }

  /** 请求github获取最新版本 */
  const getLatestRelease = async (): Promise<IReqRes<IRelease>> => {
    const req = safeFetch(GITHUB_LATEST_RELEASE_URL).then((res) => res.json())
    const { success, data: originRelease } = await processReqState<IOriginGithubRelease>(req)
    return {
      success,
      data: success ? formatUpdateLog(originRelease!) : undefined,
    }
  }

  /** 请求github获取更新列表 */
  const getReleases = async (): Promise<IReqRes<IRelease[]>> => {
    const req = safeFetch(GITHUB_RELEASES_URL).then((res) => res.json())
    const { success, data: originReleases = [] } = await processReqState<IOriginGithubRelease[]>(req)
    if (success) {
      const releases = originReleases
        .filter(({ prerelease, draft }) => !prerelease && !draft)
        .map((originRelease) => formatUpdateLog(originRelease))
      return { success: true, data: releases }
    } else {
      return { success: false }
    }
  }

  return {
    getReleases,
    getLatestRelease,
  }
}

export default useUpdateLogs