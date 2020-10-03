import { Camera } from "./camera"
import { Clock } from "./clock"
import { Collider } from "./collision"
import { FallingBlock } from "./falling-block"
import { canvas, context } from "./graphics"
import { mapBlockSize } from "./map-block"
import { randomRange } from "./math"
import { Player } from "./player"
import { WorldMap } from "./world-map"

const cameraStiffness = 8
const blockSpawnHeight = 1000

export class Game {
  collider = new Collider(mapBlockSize)
  map = new WorldMap(this.collider)
  player = new Player(this.collider, this.map)
  camera = new Camera()

  fallingBlocks: FallingBlock[] = []
  blockSpawnClock = new Clock(0.5)

  update(dt: number) {
    while (this.blockSpawnClock.advance(dt)) {
      this.fallingBlocks.push(
        new FallingBlock(
          this.collider,
          Math.floor(
            randomRange(this.map.left, this.map.right) / mapBlockSize,
          ) * mapBlockSize,
          -blockSpawnHeight,
        ),
      )
    }

    for (const block of this.fallingBlocks) {
      block.update(dt, this.collider)
    }

    this.player.update(dt, this.collider, this.map)
    this.camera.moveTowards(...this.player.rect.center, dt * cameraStiffness)
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    this.camera.apply(() => {
      this.map.draw()
      this.fallingBlocks.forEach((b) => b.draw())
      this.player.draw()
    })
  }
}
