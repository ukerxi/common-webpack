var path = require('path');
var webpack = require('webpack');
var utils = require('./config/utils');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');

// 合并基础配置
var webpackConfig = merge(baseWebpackConfig, {
  output: { // 测试环境不使用hash 来命名文件
    filename: utils.assetsPath('js/[name].js'),
    path: path.resolve(__dirname, '../dist')
  },
  devtool: '#cheap-module-eval-source-map',
  devServer: {
    proxy: { // 使用代理
      '/api': 'http://localhost:3000'
    },
   /* proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: {"^/api" : ""}
      }
    },*/
    contentBase: path.join(__dirname, '..', 'static'), // 指定静态文件访问路径
    compress: true, // 一切服务都启用gzip 压缩
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    port: 8080, // 指定端口
    publicPath: "/",
    noInfo: true // only errors & warns on hot reload
  },
  plugins: [
    // 指定环境变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(), // 启动热加载
    new webpack.NoEmitOnErrorsPlugin()
  ]
});

/**
 * 导出配置
 */

module.exports = webpackConfig;