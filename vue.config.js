// vue.config.js
module.exports = {
  runtimeCompiler: true,
  filenameHashing: true,
  productionSourceMap: true,
  css: {
    sourceMap: true,
    modules: false
  },
  configureWebpack: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    }
  }
}
