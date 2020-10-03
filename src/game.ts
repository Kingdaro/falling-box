import { canvas, context } from "./graphics"
import { Player } from "./player"

export class Game {
  player = new Player()

  update(dt: number) {
    this.player.update(dt)
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)
    this.player.draw()
  }
}
