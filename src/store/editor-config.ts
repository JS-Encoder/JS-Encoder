import { defineStore } from "pinia"
import { IEditorSettings, ShortcutMode, CodeFontFamily, IEditorLibraries, IEditorPrepMap, IEditorConfig } from "@type/settings"
import { DeepPartial } from "@type/types"
import { OriginLang, Prep } from "@type/prep"
import { deepCopy, isHttpUrl } from "@utils/tools/common"

export const initialSettings: IEditorSettings = {
  edit: {
    codeHinting: true,
    codeLint: true,
    lineWrapping: false,
    useEmmet: true,
  },
  indent: {
    indentWithTab: true,
    tabSize: 2,
  },
  execute: {
    autoExecute: true,
    delayTimeOfExecute: 500,
  },
  font: {
    fontSize: 13,
    fontFamily: CodeFontFamily.JET_BRAINS_MONO,
  },
  other: {
    headTags: "",
    shortcutTemplate: ShortcutMode.VSCODE,
  },
}

export const initialLibraries: IEditorLibraries = {
  style: [],
  script: [],
}

export const initialPrepMap: IEditorPrepMap = {
  [OriginLang.HTML]: Prep.HTML,
  [OriginLang.CSS]: Prep.CSS,
  [OriginLang.JAVASCRIPT]: Prep.JAVASCRIPT,
}

export const useEditorConfigStore = defineStore("editorConfig", {
  state: (): IEditorConfig => ({
    settings: { ...deepCopy(initialSettings) },
    libraries: { ...deepCopy(initialLibraries) },
    prepMap: { ...initialPrepMap },
  }),
  actions: {
    /** 更新若干设置 */
    batchUpdateEditorConfig(config: DeepPartial<IEditorConfig>): void {
      this.$patch(deepCopy(config))
    },
    updateSettings(settings: DeepPartial<IEditorSettings>): void {
      this.$patch({ settings: deepCopy(settings) })
    },
    updateLibraries(libraries: Partial<IEditorLibraries>): void {
      if (libraries.script) {
        this.libraries.script = libraries.script.filter((url) => isHttpUrl(url))
      }
      if (libraries.style) {
        this.libraries.style = libraries.style.filter((url) => isHttpUrl(url))
      }
    },
    updatePrepMap(prepMap: Partial<IEditorPrepMap>): void {
      this.$patch({ prepMap: { ...prepMap } })
    },
  },
})