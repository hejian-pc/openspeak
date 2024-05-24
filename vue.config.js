const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 7000  // 前端开发服务器端口
  },
  publicPath: "./",
  assetsDir: "static",
  outputDir: 'dist',
})

