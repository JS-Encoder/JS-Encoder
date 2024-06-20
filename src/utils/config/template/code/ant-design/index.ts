import { OriginLang } from "@type/prep"
import htmlCode from "./code.html?raw"
import babelCode from "./code.jsx?raw"

export default {
  [OriginLang.HTML]: htmlCode,
  [OriginLang.JAVASCRIPT]: babelCode,
}