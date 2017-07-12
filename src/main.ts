import * as pixi from 'pixi.js'
import { Game } from './game/game'
import { GameplayState } from './game/gameplay'

declare const module: any

function run() {
  const app = new pixi.Application()
  const game = new Game(app)
  game.setState(new GameplayState())
  document.body.innerHTML = ''
  document.body.appendChild(app.view)
}

run()
if (module.hot) module.hot.accept(run)
