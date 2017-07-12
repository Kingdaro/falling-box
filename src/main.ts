import * as pixi from 'pixi.js'
import { Game } from './game/game'
import { GameplayState } from './game/gameplay'

declare const module: any

let app: pixi.Application

function run() {
  if (app) app.destroy()
  app = new pixi.Application()

  const game = new Game(app)
  game.setState(new GameplayState())
  document.body.innerHTML = ''
  document.body.appendChild(app.view)
  app.start()
  app.view.focus()
}

run()
if (module.hot) module.hot.accept(run)
