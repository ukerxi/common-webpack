var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var utils = require('./config/utils');

// 处理文件路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
module.exports = {
  entry: utils.getEntry('./src/pages/**/*.js'),// 获取入口, 如有通用模块，客进行配置 'vender'
  output: {
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
    path: resolve('dist'),
    publicPath: "/" // 指定文件路径，防止引入资源生成的相对路劲造成文件访问不到，例如图片资源，也可以指定cdn 服务器
  },
  resolve: {

  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        include: [resolve('src')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      // 处理html文件，主要处理资源路劲问题
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ].concat(utils.styleLoaders({
      sourceMap: true,
      extract: true
    }))
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: resolve(""), // 设置根路径(因为配置文件放在了build目录下，不是根目录，所以必须设置)
      exclude: ['test.js'], // 设置不清除文件
      verbose: true, // 输出日志
      dry: false
    }),
    new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css')), // 生成单独的css文件
    new CopyWebpackPlugin([  // 接受数组参数，可以同时设置多个复制
      {
        from: resolve("static"), // 复制什么
        to: 'static' , // 复制到哪里去
        ignore: ['.*'] // 正则匹配忽略什么不进行复制
      }
    ])
  ].concat(utils.getHtml('./src/pages/**/*.html')) // 添加html 模板
}