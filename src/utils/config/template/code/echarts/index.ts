import { OriginLang } from "@type/prep"
import htmlCode from "./code.html?raw"
import jsCode from "./code.js?raw"

export default {
  [OriginLang.HTML]: htmlCode,
  [OriginLang.JAVASCRIPT]: jsCode,
}