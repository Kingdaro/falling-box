import { Camera } from "./camera"
import { canvas, context } from "./graphics"
import { Player } from "./player"
import { Rect } from "./rect"

const mapScale = 50

const cameraStiffness = 8

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
  camera = new Camera()

  mapBlocks: Rect[] = [
    mapBlock(0, 0, 30, 1),
    mapBlock(1, 1, 28, 1),
    mapBlock(2, 2, 26, 1),
  ]

  update(dt: number) {
    this.player.update(dt)
    this.camera.moveTowards(...this.player.rect.center, dt * cameraStiffness)
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    this.camera.apply(() => {
      for (const block of this.mapBlocks) {
        context.fillStyle = "white"
        context.fillRect(...block.values)
      }

      this.player.draw()
    })
  }
}
