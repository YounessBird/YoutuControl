const path = require("path");
//const nodeExternals = require("webpack-node-externals");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  devServer: {
    contentBase: path.resolve(__dirname, "."),
    historyApiFallback: true,
  },
  entry: {
    popup: path.resolve(__dirname, "./scripts/index-popup.js"),
    background: path.resolve(__dirname, "./scripts/background.js"),
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                {
                  plugins: ["@babel/plugin-proposal-class-properties"],
                },
              ],
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "popup.html",
      template: "./popup.html",
      chunks: ["popup"],
    }),
    new CopyWebpackPlugin([
      { from: "./manifest.json", to: "[name].[ext]" },
      //{ from: "./scripts/background.js", to: "./scripts/[name].[ext]" },
      { from: "./images/*.png", to: "./images/[name].[ext]" },
      { from: "./scripts/content.js", to: "./scripts/[name].[ext]" },
      { from: "./css/replyLoop.css", to: "./css/[name].[ext]" },
      { from: "./scripts/store.js", to: "./scripts/[name].[ext]" },
    ]),
    new CleanWebpackPlugin(),
  ],
};
