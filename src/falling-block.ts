import { Collider } from "./collision.old"
import { Entity, EntityGroup } from "./entity"
import { context } from "./graphics"
import { MapBlock, mapBlockSize } from "./map-block"
import { roundToNearest } from "./math"
import { Rect } from "./rect"
import { StaticBlock } from "./static-block"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const verticalSpawnPosition = -1500
const gravity = 800
const terminalVelocity = 800

export class FallingBlock extends Entity {
  rect
  yvel = 0

  constructor(
    private readonly collider: Collider,
    private readonly staticBlocks: EntityGroup,
    map: WorldMap,
  ) {
    super()

    this.rect = new Rect(
      vec(mapBlockSize),
      vec(map.getRespawnPosition(), verticalSpawnPosition),
    )
  }

  onAdded() {
    const [left, top, width, height] = this.rect.values
    this.collider.add(this, left, top, width - 1, height)
  }

  onRemoved() {
    this.collider.remove(this)
  }

  update(dt: number) {
    this.yvel = Math.min(this.yvel + gravity * dt, terminalVelocity)

    const [finalX, finalY, collisions] = this.collider.move(
      this,
      this.rect.left,
      this.rect.top + this.yvel * dt,
      (other) => {
        if (other instanceof MapBlock || other instanceof StaticBlock) {
          return "touch"
        }
      },
    )

    if (collisions.some((col) => col.normal.y < 0)) {
      this.destroy()

      this.staticBlocks.add(
        new StaticBlock(
          this.collider,
          vec(finalX, roundToNearest(finalY, mapBlockSize)),
        ),
      )
    } else {
      this.rect.position = vec(finalX, finalY)
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
