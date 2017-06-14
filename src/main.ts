declare const require: Function
declare const module: any

function run() {
  const game = require('./game')
  game.run()
}

run()
if (module.hot) {
  module.hot.accept('./game', run)
}
