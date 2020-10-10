import { Camera } from "./camera"
import { Clock } from "./clock"
import { Collider } from "./collision.old"
import { EntityGroup } from "./entity"
import { FallingBlock } from "./falling-block"
import { canvas, context } from "./graphics"
import { mapBlockSize } from "./map-block"
import { Player } from "./player"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const cameraStiffness = 8
const cameraOffset = vec(0, -150)

export class Game {
  collider = new Collider(mapBlockSize)
  map = new WorldMap(this.collider)
  player = new Player(this.collider, this.map)
  camera = new Camera()

  fallingBlocks = new EntityGroup()
  staticBlocks = new EntityGroup()
  blockSpawnClock = new Clock(0.3)

  update(dt: number) {
    this.fallingBlocks.update(dt)
    this.staticBlocks.update(dt)

    this.player.update(dt)

    this.camera.moveTowards(
      this.player.rect.center.plus(cameraOffset),
      dt * cameraStiffness,
    )

    while (this.blockSpawnClock.advance(dt)) {
      this.fallingBlocks.add(
        new FallingBlock(this.collider, this.staticBlocks, this.map),
      )
    }
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    this.camera.apply(() => {
      this.map.draw()
      this.staticBlocks.draw()
      this.fallingBlocks.draw()
      this.player.draw()
    })
  }
}
