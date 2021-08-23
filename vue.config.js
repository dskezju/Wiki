const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

let login_url = 'http://localhost:8000/login',
    back_url = 'http://localhost:8080',
    base_url = 'http://localhost:8003'

process.env.VUE_APP_LOGIN_URL = login_url + '?redirect=' + base_url
process.env.VUE_APP_BACK_URL = back_url


const name = 'Wiki'

module.exports = {
  outputDir: 'dist',
  publicPath: process.env.NODE_ENV === 'production' ? '/workspace/wiki' : '/',
  lintOnSave: true,
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        'assets': resolve('src/assets'),
        'pages': resolve('src/pages')
      }
    }
  },
  devServer: {
    open: false,
    port: 8008, // 自定义修改8080端口
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icon')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
