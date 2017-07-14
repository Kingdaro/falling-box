import { Game } from './game/game'
import { GameplayState } from './game/gameplay'

declare const module: any

function run() {
  const game = new Game()
  game.setState(new GameplayState())
  game.start()
  document.body.innerHTML = ''
  document.body.appendChild(game.view).focus()
}

run()
if (module.hot) module.hot.accept(run)
