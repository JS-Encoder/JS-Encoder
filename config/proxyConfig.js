module.exports = {
  proxy: {
    '/github': {    //将www.exaple.com印射为/apis
      target: 'https://github.com',  // 接口域名
      secure: true,  // 如果是https接口，需要配置这个参数
      changeOrigin: true,  //是否跨域
      pathRewrite: {
        '^/github': ''   //需要rewrite的,
      }
    },
    '/gitUser': {
      target: 'https://api.github.com',
      secure: true,
      changeOrigin: true,
      pathRewrite: {
        '^/gitUser': ''
      }
    }
  }
}