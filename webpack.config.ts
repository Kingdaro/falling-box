import * as webpack from 'webpack'
import * as path from 'path'
import * as HTMLPlugin from 'html-webpack-plugin'

const config: webpack.Configuration = {
  entry: './src/main',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'build.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  devServer: {
    noInfo: true,
  },
  performance: {
    hints: false,
  },
  plugins: [new HTMLPlugin({ template: './src/index.html' })],
  devtool: '#source-map',
}

export default config
