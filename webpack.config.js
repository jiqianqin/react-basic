var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var glob = require('glob');
var _ = require('lodash');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var del = require('del');
var configFile = {
  css: '[name].css',
  outputJs: '[name].js',
  commonJs: 'common.js',
}
del('dist')
var ENV = {
  development: 'dev',
  product: 'prd',
  uat: 'uat',
  stage: 'stg',
}

var options = {
  env: process.env.NODE_ENV || ENV.development
}
// 生产环境使用hash
if (options.env == ENV.stage || options.env == ENV.product) {
  configFile = {
    css: '[name]-[hash:6].css',
    outputJs: '[name]-[hash:6].js',
    commonJs: 'common-[hash:6].js',
  }
}
var cssExtractor = new ExtractTextPlugin(configFile.css);
// 获取指定路径下的入口文件
function getEntries(globPath, exclude) {
  var files = glob.sync(path.join(__dirname, globPath)),
    entries = {};
  files.forEach(function (filepath) {
    if (exclude && exclude.test(filepath)) {
      return;
    }
    // 取倒数第二层(view下面的文件夹)做包名
    var split = filepath.split('/');
    var name = split[split.length - 2];
    entries[name + ''] = filepath;
  });

  return entries;
}

var entries = getEntries('src/modules/*/index.js', /common/);

var config = {
  entry: entries,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: configFile.outputJs,
    //publicPath: './dist',
    chunkFilename: "[name].js"
    //libraryTarget: 'umd'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify('production')
      }
    }),
    new HtmlWebpackPlugin({
      hash: false,
      template: 'src/template.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: configFile.commonJs
    }),
    cssExtractor
  ],
  devServer: {
    hot: true,
    inline: true,
    port: 9000,
    stats: {colors: true, progress: false},
    compress: true,
    quiet: false,
    clientLogLevel: 'info',
    open: true,
    proxy: {
      '/api-uc': {
        changeOrigin: true,
        target: 'http://localhost:3000',
        secure: false,
        //pathRewrite: {'^/api': ''}
      },
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:3000',
        secure: false,
        //pathRewrite: {'^/api': ''}
      },
      '/ueditor': {
        changeOrigin: true,
        target: 'http://localhost:3000/',
        secure: false,
        pathRewrite: {'^/api': ''}
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.(css)$/,
        use: cssExtractor.extract(["css-loader", "postcss-loader"])//"style-loader!css-loader!postcss-loader"
      },
      {
        test: /\.(scss)$/,
        loader: "style-loader!css-loader!postcss-loader!sass-loader"
      },
      {
        test: /\.(less)$/,
        loader: "style-loader!css-loader!postcss-loader!less-loader"
      },
      {
        //test: path.join(__dirname, 'src'),
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        loader: 'react-hot-loader!babel-loader'
      },
    ]
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: ['.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
  },
};

Object.keys(entries).forEach(function (name) {
  // 每个页面生成一个entry，如果需要HotUpdate，在这里修改entry
  config.entry[name] = entries[name];
  let file = entries[name];
  let filePath = file.split(path.sep);
  let curdir = __dirname.split(path.sep);
  curdir.pop();
  var configFile = path.join(__dirname, 'src', 'modules', name, 'config.json');
  let perConfig = require(configFile);
  // 每个页面生成一个html
  var plugin = new HtmlWebpackPlugin({
    // 生成出来的html文件名
    filename: name + '.html',
    // 每个html的模版，这里多个页面使用同一个模版
    template: path.join(__dirname, 'src', 'template.html'),
    // 自动将引用插入html
    inject: 'body',
    title: perConfig.html.title,
    // 每个html引用的js模块，也可以在这里加上vendor等公用模块
    chunks: ['common', name]
  });
  config.plugins.push(plugin);
})

module.exports = config;
