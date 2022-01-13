module.exports = {
  presets: [
    ["@babel/preset-env"],
    ["@vue/cli-plugin-babel/preset",
      {
        useBuiltIns: "entry",
        polyfills: [
          'es6.promise',
          'es6.symbol',
          'es6.array.iterator'
        ]
      }
    ]
  ],
  plugins: []
};
