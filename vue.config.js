const path = require('path')
const resolve = (dir) => path.join(__dirname, dir)
const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const cdn = {
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    axios: 'axios',
    jszip: 'JSZip',
    prettier: 'prettier',
  },
  js: [
    'https://cdn.staticfile.org/vue/2.6.11/vue.min.js',
    'https://cdn.staticfile.org/vuex/3.5.1/vuex.min.js',
    'https://cdn.staticfile.org/axios/0.19.2/axios.min.js',
    'https://cdn.staticfile.org/jszip/3.7.1/jszip.min.js',
    'https://cdn.staticfile.org/prettier/2.5.1/standalone.min.js',
  ]
}
// 本地环境是否需要使用cdn
const devNeedCdn = false

module.exports = {
  publicPath: IS_PROD ? './' : '/', // 默认'/'，部署应用包时的基本 URL
  outputDir: 'dist', // 'dist', 生产环境构建文件的目录
  assetsDir: 'assets', // 相对于outputDir的静态资源(js、css、img、fonts)目录
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  productionSourceMap: !IS_PROD, // 生产环境的 source map
  parallel: require('os').cpus().length > 1,
  pwa: {},
  devServer: {
    proxy: {
      '/qiNiuCdn': {
        target: 'http://picstore.lliiooiill.cn',
        secure: true,
        changeOrigin: true,
        pathRewrite: {
          '^/qiNiuCdn': '',
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
    // 配置gzip
    //gzip压缩
    const productionGzipExtensions = ['html', 'js', 'css']
    config.plugins.push(
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' + productionGzipExtensions.join('|') + ')$'
        ),
        threshold: 10240, // 只有大小大于该值的资源会被处理 10240
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        deleteOriginalAssets: false // 删除原文件
      })
    )

    if (IS_PROD || devNeedCdn) config.externals = cdn.externals
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
    config.plugin('html').tap(args => {
      // 生产环境或本地需要cdn时，才注入cdn
      if (IS_PROD || devNeedCdn) args[0].cdn = cdn
      return args
    })
    if (IS_PROD) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    }
  },
  css: {
    extract: IS_PROD,
    sourceMap: false,
    loaderOptions: {
      scss: {
        additionalData: `@import "@scss/main.scss";`,
      },
    },
  },
}
