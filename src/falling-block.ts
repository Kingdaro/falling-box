import { Collider } from "./collision"
import { context } from "./graphics"
import { MapBlock, mapBlockSize } from "./map-block"
import { Rect } from "./rect"

const gravity = 800

export class FallingBlock {
  rect
  yvel = 0
  state: "falling" | "static" = "falling"

  constructor(collider: Collider, x: number, y: number) {
    this.rect = new Rect(x, y, mapBlockSize)

    const [left, top, width, height] = this.rect.values
    collider.add(this, left, top, width - 1, height - 1)
  }

  update(dt: number, collider: Collider) {
    if (this.state === "falling") {
      this.yvel += gravity * dt
    } else {
      this.yvel = 0
    }

    const [finalX, finalY, collisions] = collider.move(
      this,
      this.rect.left,
      this.rect.top + this.yvel * dt,
      (other) => {
        if (other instanceof MapBlock || other instanceof FallingBlock) {
          return "slide"
        }
      },
    )
    this.rect.setTopLeft(finalX, finalY)

    for (const { normal } of collisions) {
      if (normal.y < 0) {
        this.state = "static"
        this.rect.top = Math.round(this.rect.top / 50) * 50
      }
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
