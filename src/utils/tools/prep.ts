import { MimeType, OriginLang, Prep } from "@type/prep"

export const getPrepOrigin = (prep: string): OriginLang | void => {
  switch (prep) {
    case Prep.HTML:
    case Prep.MARKDOWN:
    case Prep.PUG:
      return OriginLang.HTML
    case Prep.CSS:
    case Prep.SASS:
    case Prep.SCSS:
    case Prep.LESS:
    case Prep.STYLUS:
      return OriginLang.CSS
    case Prep.JAVASCRIPT:
    case Prep.TYPESCRIPT:
    case Prep.COFFEESCRIPT:
    case Prep.BABEL:
    case Prep.VUE:
      return OriginLang.JAVASCRIPT
    default: {
      return
    }
  }
}

export const getOriginByMimeType = (mimeType: string): OriginLang | void => {
  switch (mimeType) {
    case MimeType.HTML:
    case MimeType.MARKDOWN:
    case MimeType.PUG:
      return OriginLang.HTML
    case MimeType.CSS:
    case MimeType.SASS:
    case MimeType.SCSS:
    case MimeType.LESS:
    case MimeType.STYLUS:
      return OriginLang.CSS
    case MimeType.JAVASCRIPT:
    case MimeType.TYPESCRIPT:
    case MimeType.COFFEESCRIPT:
    case MimeType.Babel:
    case MimeType.VUE:
     return OriginLang.JAVASCRIPT
    default: {
      return
    }
  }
}

export const prep2MimeTypeMap = {
  [Prep.HTML]: MimeType.HTML,
  [Prep.MARKDOWN]: MimeType.MARKDOWN,
  [Prep.PUG]: MimeType.PUG,
  [Prep.CSS]: MimeType.CSS,
  [Prep.SASS]: MimeType.SASS,
  [Prep.SCSS]: MimeType.SCSS,
  [Prep.LESS]: MimeType.LESS,
  [Prep.STYLUS]: MimeType.STYLUS,
  [Prep.JAVASCRIPT]: MimeType.JAVASCRIPT,
  [Prep.TYPESCRIPT]: MimeType.TYPESCRIPT,
  [Prep.COFFEESCRIPT]: MimeType.COFFEESCRIPT,
  [Prep.BABEL]: MimeType.Babel,
  [Prep.VUE]: MimeType.VUE,
}

export const mimeType2PrepMap = {
  [MimeType.HTML]: Prep.HTML,
  [MimeType.MARKDOWN]: Prep.MARKDOWN,
  [MimeType.PUG]: Prep.PUG,
  [MimeType.CSS]: Prep.CSS,
  [MimeType.SASS]: Prep.SASS,
  [MimeType.SCSS]: Prep.SCSS,
  [MimeType.LESS]: Prep.LESS,
  [MimeType.STYLUS]: Prep.STYLUS,
  [MimeType.JAVASCRIPT]: Prep.JAVASCRIPT,
  [MimeType.TYPESCRIPT]: Prep.TYPESCRIPT,
  [MimeType.COFFEESCRIPT]: Prep.COFFEESCRIPT,
  [MimeType.Babel]: Prep.BABEL,
  [MimeType.VUE]: Prep.VUE,
}

export const prep2IconMap: Partial<Record<Prep, string>> = {
  [Prep.MARKDOWN]: "icon-markdown",
  [Prep.JAVASCRIPT]: "icon-javascript",
  [Prep.TYPESCRIPT]: "icon-typescript",
  [Prep.COFFEESCRIPT]: "icon-coffeescript",
  [Prep.BABEL]: "icon-jsx",
}