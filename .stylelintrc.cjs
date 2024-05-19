module.exports = {
  "extends": [
    "stylelint-config-standard-scss",
    "stylelint-config-standard-vue/scss",
  ],
  "rules": {
    "declaration-block-single-line-max-declarations": 10,
    "media-feature-range-notation": "prefix",
    "no-duplicate-selectors": null,
    "no-empty-source": null,
    "rule-empty-line-before": ["always", {
      "except": ["after-rule", "after-single-line-comment", "inside-block-and-after-rule", "inside-block", "first-nested"],
      "ignore": ["after-comment", "first-nested", "inside-block"]
    }],
    "value-keyword-case": null,
    "color-hex-length": null,
  }
}