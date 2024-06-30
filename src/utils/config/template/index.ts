import { initialPrepMap } from "@store/editor-config"
import { TemplateLang } from "@type/template"
import vueCodeMap from "./code/vue"
import reactCodeMap from "./code/react"
import vanillaCodeMap from "./code/vanilla"
import vueComponentCodeMap from "./code/vue-component"
import elementPlusCodeMap from "./code/element-plus"
import antDesignCodeMap from "./code/ant-design"
import echartsCodeMap from "./code/echarts"
import rxjsCodeMap from "./code/rxjs"
import { OriginLang, Prep } from "@type/prep"

export const templateCodeMap = {
  [TemplateLang.VUE]: vueCodeMap,
  [TemplateLang.REACT]: reactCodeMap,
  [TemplateLang.VANILLA]: vanillaCodeMap,
  [TemplateLang.ELEMENT_PLUS]: elementPlusCodeMap,
  [TemplateLang.ANT_DESIGN]: antDesignCodeMap,
  [TemplateLang.ECHARTS]: echartsCodeMap,
  [TemplateLang.RXJS]: rxjsCodeMap,
}

const vueScript = ["https://unpkg.com/vue@3"]

const reactScript = [
  "https://unpkg.com/react@18.3.1/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js",
]

export const templateLibrariesMap = {
  [TemplateLang.VUE]: {
    script: [...vueScript],
  },
  [TemplateLang.REACT]: {
    script: [...reactScript],
  },
  [TemplateLang.ELEMENT_PLUS]: {
    style: ["https://unpkg.com/element-plus/dist/index.css"],
    script: [
      ...vueScript,
      "https://unpkg.com/element-plus",
    ],
  },
  [TemplateLang.ANT_DESIGN]: {
    style: [
      "https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/antd/4.18.9/antd.min.css",
    ],
    script: [
      ...reactScript,
      "https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/antd/4.18.9/antd.min.js",
    ],
  },
  [TemplateLang.ECHARTS]: {
    script: [
      "https://unpkg.com/echarts",
    ],
  },
  [TemplateLang.RXJS]: {
    script: [
      "https://cdn.bootcdn.net/ajax/libs/rxjs/7.8.1/rxjs.umd.min.js",
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
  [TemplateLang.ELEMENT_PLUS]: initialPrepMap,
  [TemplateLang.ANT_DESIGN]: {
    ...initialPrepMap,
    [OriginLang.JAVASCRIPT]: Prep.BABEL,
  },
  [TemplateLang.ECHARTS]: initialPrepMap,
  [TemplateLang.RXJS]: initialPrepMap,
}

export const componentTemplateCodeMap = {
  [TemplateLang.VUE]: vueComponentCodeMap,
}

export const componentTemplateLibrariesMap = {
  [TemplateLang.VUE]: {
    script: [...vueScript],
  },
}

export const componentTemplatePrepMap = {
  [TemplateLang.VUE]: {
    [OriginLang.JAVASCRIPT]: Prep.VUE,
  },
}