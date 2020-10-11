import { Camera } from "./camera"
import { Clock } from "./clock"
import { EntityGroup } from "./entity"
import { createFallingBlock } from "./falling-block"
import { canvas, context } from "./graphics"
import { createPlayer } from "./player"
import { RectTrait } from "./traits"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const cameraStiffness = 8
const cameraOffset = vec(0, -150)

export class Game {
  // collider = new Collider(mapBlockSize)
  // staticBlocks = new EntityGroup<StaticBlock>()
  blockSpawnClock = new Clock(0.3)
  world = new EntityGroup()
  map = this.world.add(new WorldMap())
  player = this.world.add(createPlayer(this.map))
  fallingBlocks = this.world.add(new EntityGroup())
  camera = new Camera()

  update(dt: number) {
    // this.fallingBlocks.update(dt)
    // this.staticBlocks.update(dt)

    this.world.update(dt)

    this.camera.moveTowards(
      this.player.get(RectTrait).rect.center.plus(cameraOffset),
      dt * cameraStiffness,
    )

    while (this.blockSpawnClock.advance(dt)) {
      this.fallingBlocks.add(createFallingBlock(this.map, this.fallingBlocks))
    }
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    this.camera.apply(() => {
      this.world.draw()
      // this.map.draw()
      // this.staticBlocks.draw()
      // this.fallingBlocks.draw()
      // this.player.draw()
    })
  }
}
