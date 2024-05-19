export default {
  rules: {
    // List of possible errors rules within `stylelint-stylus`
    "stylus/single-line-comment-no-empty": true,
    // wrapper core rules
    "stylus/at-rule-no-unknown": true,
    "stylus/selector-type-no-unknown": true,
    "stylus/property-no-unknown": true,

    // - Don't understand the Stylus at-rules. And the `postcss-styl` atrule AST contains if, for and function calls.
    "at-rule-no-unknown": null,

    // - False positives in variables and interpolations of the Stylus.
    "property-no-unknown": null,

    // - Don't understand the Stylus selectors.
    "selector-type-no-unknown": null,
    "no-duplicate-selectors": null,
  },
}