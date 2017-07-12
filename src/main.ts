import * as pixi from 'pixi.js'

declare const require: Function
declare const module: any

class Game {
  text = this.app.stage.addChild(new pixi.Text('hi', { fill: 'white' }))

  constructor(private app: pixi.Application) {
    this.text.position.set(100, 100)
    this.text.anchor.set(0.5, 0.5)
  }

  update(dt: number) {
    this.text.rotation += dt * 3
  }
}

function run() {
  const app = new pixi.Application(1280, 720)
  const game = new Game(app)

  app.ticker.add(dt => game.update(dt / 60))

  document.body.innerHTML = ''
  document.body.appendChild(app.view)
}

run()
if (module.hot) module.hot.accept(run)
