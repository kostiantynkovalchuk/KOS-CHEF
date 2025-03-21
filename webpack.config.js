const path = require("path");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

module.exports = {
  entry: "./src/index.js", // Ensure this path is correct
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  mode: "development", // Set the mode to 'development' or 'production'
  resolve: {
    fallback: {
      path: require.resolve("path-browserify"),
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
      vm: require.resolve("vm-browserify"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  plugins: [
    new Dotenv({
      path: "./hf.env", // Path to your .env file
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
};
