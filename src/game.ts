import { canvas, context } from "./graphics"
import { Player } from "./player"
import { Rect } from "./rect"

const mapScale = 50

function mapBlock(left: number, top: number, width: number, height: number) {
  return new Rect(
    left * mapScale,
    top * mapScale,
    width * mapScale,
    height * mapScale,
  )
}

export class Game {
  player = new Player()

  mapBlocks: Rect[] = [
    mapBlock(0, 0, 30, 1),
    mapBlock(1, 1, 28, 1),
    mapBlock(2, 2, 26, 1),
  ]

  update(dt: number) {
    this.player.update(dt)
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    for (const block of this.mapBlocks) {
      context.fillStyle = "white"
      context.fillRect(...block.components)
    }

    this.player.draw()
  }
}
