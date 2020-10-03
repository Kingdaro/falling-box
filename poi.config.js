module.exports = {
  entry: ["src/registerServiceWorker", "src/main"],
  plugins: [
    { resolve: "@poi/plugin-typescript" },
    { resolve: "@poi/plugin-pwa" },
  ],
}
