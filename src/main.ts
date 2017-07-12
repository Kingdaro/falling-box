import * as pixi from 'pixi.js'
import { Game } from './game/game'
import { GameplayState } from './game/gameplay'

declare const require: Function
declare const module: any

function run() {
  const app = new pixi.Application(1280, 720)
  const game = new Game(app)
  game.setState(new GameplayState())
  app.start()
  document.body.innerHTML = ''
  document.body.appendChild(app.view)
}

run()
if (module.hot) module.hot.accept(run)
