/**
 * Created by ukerxi on 2017/10/12.
 * 编译使用的通用工具方法
 */
var path = require('path');
var glob = require('glob');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 *  解析最终生成资源路径
 */
var assetsPath = function (_path) {
  var assetsSubDirectory = "static";
  return path.posix.join(assetsSubDirectory, _path)
}


/**
 *  多种css loader 生成配置
 */
var cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'style-loader'
      })
    } else {
      return ['style-loader'].concat(loaders)
    }
  }
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}
var styleLoaders = function (options) {
  var output = []
  var loaders = cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

/**
 * 生成多页面入口
 * @param globPath 入口路劲
 */
var getEntry = function (globPath) {
  var _object = {};
  var tmp, pathname;
  glob.sync(globPath).forEach(function (entry) {
    tmp = entry.split('/').splice(-2);
    pathname = tmp[0]; // 获取入口名字
    _object[pathname] = entry;
  });
  return _object
}

/**
 * 生成多页面html 模板
 * @param globPath 入口路劲
 */
var getHtml = function (globPath) {
  var _list = [];
  var tmp, pathname;
  glob.sync(globPath).forEach(function (entry) {
    tmp = entry.split('/').splice(-2);
    pathname = tmp[0]; // 获取入口名字
    var _object = {
      title: '模板',
      filename: pathname + '.html',
      template: entry,
      chunks: [ 'vendor', 'manifest', pathname],
     /* minify: { // 压缩选项
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },*/
      inject: 'body',
      chunksSortMode: 'dependency'
    }
    _list.push(new HtmlWebpackPlugin(_object));
  });
  return _list;
}

/**
 *  导出配置
 */
module.exports = {
  assetsPath: assetsPath,
  styleLoaders: styleLoaders,
  getEntry: getEntry,
  getHtml: getHtml
}