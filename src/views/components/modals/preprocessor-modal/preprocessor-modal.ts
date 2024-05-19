import { OriginLang, Prep } from "@type/prep"

const transPrep2Options = (prepList: Prep[]) => {
  return prepList.map((prep) => ({ value: prep }))
}

export const prepInfoList = [
  {
    title: "HTML",
    origin: OriginLang.HTML,
    prepList: transPrep2Options([ Prep.HTML, Prep.MARKDOWN, Prep.PUG ]),
  },
  {
    title: "CSS",
    origin: OriginLang.CSS,
    prepList: transPrep2Options([ Prep.CSS, Prep.SASS, Prep.SCSS, Prep.LESS, Prep.STYLUS ]),
  },
  {
    title: "JavaScript",
    origin: OriginLang.JAVASCRIPT,
    prepList: transPrep2Options([ Prep.JAVASCRIPT, Prep.TYPESCRIPT, Prep.BABEL, Prep.COFFEESCRIPT ]),
  },
]