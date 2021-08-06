const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

module.exports = {
  publicPath: process.env.NODE_ENV === 'development' ? '/' : './', // 默认'/'，部署应用包时的基本 URL
  outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'assets', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require('os').cpus().length > 1,
  pwa: {},
  devServer: {
    proxy: {
      '/cdnJS': {
        target: 'https://api.cdnjs.com/libraries',
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/cdnJS': '',
        },
      },
      '/npmSearch': {
        target: 'https://registry.npmjs.org',
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/npmSearch': '',
        },
      }
    },
  },
  configureWebpack: config => {
    config.module.rules.push({
      /*test: /\.extension$/,*/
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto'
    })
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@scss', resolve('src/assets/scss'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'))
      .set('@utils', resolve('src/utils'))
  },
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      scss: {
        prependData: `
        @import "@scss/main.scss";
        `,
      },
    },
  },
}
