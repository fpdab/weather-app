const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle[contenthash].js",
    clean: true,
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "[name][ext]",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 3000,
    open: true,
    watchFiles: ["src/*.html"],
    hot: true,
    compress: true,
    historyApiFallback: true,
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      title: "Todo App",
      filename: "index.html",
      template: "src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        type: "asset / resource",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
}
