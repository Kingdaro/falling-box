import { Collider } from "./collision"
import { context } from "./graphics"
import { isAnyDown } from "./keyboard"
import { MapBlock } from "./map-block"
import { Rect } from "./rect"

const playerSpeed = 500
const playerGravity = 800

export class Player {
  rect = new Rect(0, -300, 40)
  xvel = 0
  yvel = 0

  update(dt: number, collider: Collider) {
    let xvel = 0
    if (isAnyDown("ArrowLeft", "KeyA")) xvel -= playerSpeed
    if (isAnyDown("ArrowRight", "KeyR")) xvel += playerSpeed

    this.xvel = xvel
    this.yvel += playerGravity * dt

    const [finalX, finalY, collisions] = collider.move(
      this,
      this.rect.left + this.xvel * dt,
      this.rect.top + this.yvel * dt,
      (other) => (other instanceof MapBlock ? "slide" : undefined),
    )
    this.rect.setTopLeft(finalX, finalY)

    for (const col of collisions) {
      if (col.normal.x != 0) this.xvel = 0
      if (col.normal.y != 0) this.yvel = 0
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.values)
  }
}
