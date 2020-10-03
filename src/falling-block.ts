import { Collider } from "./collision"
import { context } from "./graphics"
import { MapBlock, mapBlockSize } from "./map-block"
import { Rect } from "./rect"
import { StaticBlock } from "./static-block"

const gravity = 800

export class FallingBlock {
  rect
  yvel = 0
  shouldBecomeStatic = false

  constructor(collider: Collider, x: number, y: number) {
    this.rect = new Rect(x, y, mapBlockSize)

    const [left, top, width, height] = this.rect.values
    collider.add(this, left, top, width - 1, height)
  }

  update(dt: number, collider: Collider) {
    this.yvel += gravity * dt

    const [finalX, finalY, collisions] = collider.move(
      this,
      this.rect.left,
      this.rect.top + this.yvel * dt,
      (other) => {
        if (other instanceof MapBlock || other instanceof StaticBlock) {
          return "touch"
        }
      },
    )
    this.rect.setTopLeft(finalX, finalY)
    this.shouldBecomeStatic = collisions.length > 0
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
