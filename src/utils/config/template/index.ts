import { initialPrepMap } from "@store/editor-config"
import { TemplateLang } from "@type/template"
import vueCodeMap from "./code/vue"
import reactCodeMap from "./code/react"
import vanillaCodeMap from "./code/vanilla"
import vueComponentCodeMap from "./code/vue-component"
import { OriginLang, Prep } from "@type/prep"

export const templateCodeMap = {
  [TemplateLang.VUE]: vueCodeMap,
  [TemplateLang.REACT]: reactCodeMap,
  [TemplateLang.VANILLA]: vanillaCodeMap,
}

export const templateLibrariesMap = {
  [TemplateLang.VUE]: {
    script: ["https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.min.js"],
  },
  [TemplateLang.REACT]: {
    script: [
      "https://cdn.staticfile.org/react/17.0.0/umd/react.development.min.js",
      "https://cdn.staticfile.org/react-dom/17.0.0/umd/react-dom.development.min.js",
    ],
  },
}

export const templatePrepMap = {
  [TemplateLang.VANILLA]: initialPrepMap,
  [TemplateLang.VUE]: initialPrepMap,
  [TemplateLang.REACT]: {
    ...initialPrepMap,
    [OriginLang.JAVASCRIPT]: Prep.BABEL,
  },
}

export const componentTemplateCodeMap = {
  [TemplateLang.VUE]: vueComponentCodeMap,
}

export const componentTemplateLibrariesMap = {
  [TemplateLang.VUE]: {
    script: ["https://cdn.bootcdn.net/ajax/libs/vue/3.3.4/vue.global.min.js"],
  },
}
export const componentTemplatePrepMap = {
  [TemplateLang.VUE]: {
    [OriginLang.JAVASCRIPT]: Prep.VUE,
  },
}