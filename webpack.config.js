const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    background: './src/background.ts',
    options: './src/options.ts'
  },
  module: {
    rules: [
      {
        test: /\.vue?$/,
        use: 'vue-loader',
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      }
    ]
  },
  resolve: {
    extensions: [ '.vue', '.ts', '.js' ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CopyWebpackPlugin([
      '*.html',
      '*.png'
    ]),
    new webpack.DefinePlugin({
      BACKEND: process.env.BACKEND
    })
  ]
}
