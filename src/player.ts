import { Collider } from "./collision"
import { context } from "./graphics"
import { isDown, wasPressed } from "./keyboard"
import { MapBlock } from "./map-block"
import { Rect } from "./rect"

const speed = 500
const gravity = 2500
const jumpSpeed = 800

export class Player {
  rect = new Rect(0, -300, 40)
  xvel = 0
  yvel = 0

  update(dt: number, collider: Collider) {
    let xvel = 0
    if (["ArrowLeft", "KeyA"].some(isDown)) xvel -= speed
    if (["ArrowRight", "KeyR"].some(isDown)) xvel += speed
    this.xvel = xvel

    if (wasPressed("ArrowUp")) {
      this.yvel = -jumpSpeed
    } else {
      this.yvel += gravity * dt
    }

    const [finalX, finalY, collisions] = collider.move(
      this,
      this.rect.left + this.xvel * dt,
      this.rect.top + this.yvel * dt,
      (other) => {
        if (other instanceof MapBlock) return "slide"
      },
    )
    this.rect.setTopLeft(finalX, finalY)

    // prettier-ignore
    for (const col of collisions) {
      if (col.normal.x !== 0 && Math.sign(col.normal.x) !== Math.sign(this.xvel)) this.xvel = 0
      if (col.normal.y !== 0 && Math.sign(col.normal.y) !== Math.sign(this.yvel)) this.yvel = 0
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.values)
  }
}
