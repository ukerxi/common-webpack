var path = require('path');
var webpack = require('webpack');
var utils = require('./config/utils');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

// 合并基础配置
var webpackConfig = merge(baseWebpackConfig, {
  devtool: '#source-map',
  plugins: [
    // 指定环境变量
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.HashedModuleIdsPlugin(), // 防止vender 根据 module.id 进行变化
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // webpack 的样板(boilerplate)和 manifest 提取出来
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // js 压缩
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // css 压缩
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
});

/**
 * 导出配置
 */

module.exports = webpackConfig;