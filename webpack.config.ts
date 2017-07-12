import * as webpack from 'webpack'
import * as path from 'path'
import * as HTMLPlugin from 'html-webpack-plugin'

const config: webpack.Configuration = {
  entry: {
    app: ['./src/main'],
    lib: ['pixi.js'],
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].bundle.js',
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
  plugins: [
    new HTMLPlugin({ template: './src/index.html' }),
    new webpack.optimize.CommonsChunkPlugin({ names: ['lib'] }),
    new webpack.NamedModulesPlugin(),
  ],
  devtool: '#source-map',
}

export default config
