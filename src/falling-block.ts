import { Collider } from "./collision"
import { Entity, EntityGroup } from "./entity"
import { context } from "./graphics"
import { MapBlock, mapBlockSize } from "./map-block"
import { randomRange, roundToNearest } from "./math"
import { Rect } from "./rect"
import { StaticBlock } from "./static-block"
import { WorldMap } from "./world-map"

const blockSpawnHeight = 1500
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

    const x =
      Math.floor(randomRange(map.left, map.right) / mapBlockSize) * mapBlockSize

    this.rect = new Rect(x, -blockSpawnHeight, mapBlockSize)
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
          finalX,
          roundToNearest(finalY, mapBlockSize),
        ),
      )
    } else {
      this.rect.setTopLeft(finalX, finalY)
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
