// extends: ["plugin:vue/essential", "@vue/standard"],
// parserOptions: {
//   parser: "babel-eslint"
// },
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/standard"],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "off",
    "no-empty": "off",
    quotes: ["off", "double"],
    semi: "off",
    eqeqeq: "off",
    indent: "off",
    "no-throw-literal": "off",
    "handle-callback-err": "off",
    "space-before-function-paren": ["off", "never"],
    "no-extend-native": "off",
    curly: "off",
    "next-line": "off",
    "key-spacing": "off",
    camelcase: "off",
    "standard/computed-property-even-spacing": "off",
    "no-undef": "off",
    "prefer-const": "off",
    "dot-notation": "off",
    "no-case-declarations": "off",
    "prefer-promise-reject-errors": "off",
    "quote-props": "off",
    "no-irregular-whitespace": "off" // 这禁止掉 空格报错检查
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
