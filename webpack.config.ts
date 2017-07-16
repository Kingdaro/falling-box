import * as webpack from 'webpack'
import * as path from 'path'
import * as HTMLPlugin from 'html-webpack-plugin'

const config: webpack.Configuration = {
  entry: {
    app: ['./src/main'],
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
  plugins: [
    new HTMLPlugin({ template: './src/index.html' }),
    new webpack.NamedModulesPlugin(),
  ],
  devtool: '#source-map',
}

export default config
