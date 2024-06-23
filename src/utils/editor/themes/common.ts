import { CodeFontFamily } from "@type/settings"

const commonStyle = {
  ".cm-selectionMatch": {
    height: "100%",
    display: "inline-block",
  },
  ".cm-scroller::-webkit-scrollbar": {
    width: "12px",
    height: "12px",
    cursor: "default",
  },
  ".cm-scroller::-webkit-scrollbar-thumb": {
    backgroundColor: "var(--color-main-bg-1)",
  },
  ".cm-scroller::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "var(--color-main-bg-0)",
  },
  ".cm-scroller::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  ".cm-scroller::-webkit-scrollbar-corner": {
    backgroundColor: "transparent",
  },
  ".cm-panels": {
    position: "static",
  },
  ".cm-diagnostic": {
    borderLeftWidth: "2px",
  },
  ".cm-tooltip": {
    fontSize: "13px",
    fontFamily: CodeFontFamily.JET_BRAINS_MONO,
    backgroundColor: "var(--color-main-bg-1)",
    border: "1px solid #000",
    boxSizing: "border-box",
  },
  "& .cm-gutters": {
    borderRight: "none",
  },
  "& .cm-panels-top": {
    borderBottom: "none",
  },
  "& .cm-panels-bottom": {
    borderTop: "none",
  },
  ".cm-gutterElement": {
    fontFamily: "monospace",
  },
  "& .cm-tooltip.cm-tooltip-autocomplete > ul::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
    cursor: "default",
  },
  "& .cm-tooltip.cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb": {
    backgroundColor: "var(--color-main-bg-2)",
  },
  "& .cm-tooltip.cm-tooltip-autocomplete > ul::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "var(--color-main-bg-0)",
  },
  "& .cm-tooltip.cm-tooltip-autocomplete > ul::-webkit-scrollbar-track": {
    backgroundColor: "transparent",
  },
  "& .cm-tooltip.cm-tooltip-autocomplete > ul::-webkit-scrollbar-corner": {
    backgroundColor: "transparent",
  },
  "& .cm-tooltip.cm-tooltip-autocomplete > ul": {
    maxHeight: "15em",
    backgroundColor: "var(--color-main-bg-1)",
  },
  "& .cm-tooltip.cm-tooltip-autocomplete > ul > li": {
    padding: "3px 4px",
  },
}

export default commonStyle