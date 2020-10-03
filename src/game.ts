import { Camera } from "./camera"
import { Collider } from "./collision"
import { canvas, context } from "./graphics"
import { MapBlock, mapBlockSize } from "./map-block"
import { Player } from "./player"

const cameraStiffness = 8

export class Game {
  player = new Player()
  camera = new Camera()
  collider = new Collider(mapBlockSize)

  mapBlocks = [
    new MapBlock(0, 0, 30, 1),
    new MapBlock(1, 1, 28, 1),
    new MapBlock(2, 2, 26, 1),
  ]

  constructor() {
    this.collider.add(this.player, ...this.player.rect.values)
    for (const block of this.mapBlocks) {
      this.collider.add(block, ...block.rect.values)
    }
  }

  update(dt: number) {
    this.player.update(dt, this.collider)
    this.camera.moveTowards(...this.player.rect.center, dt * cameraStiffness)
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    this.camera.apply(() => {
      for (const block of this.mapBlocks) {
        block.draw()
      }
      this.player.draw()
    })
  }
}
