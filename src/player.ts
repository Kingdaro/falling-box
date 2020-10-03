import { Collider } from "./collision"
import { context } from "./graphics"
import { isDown, wasPressed } from "./keyboard"
import { MapBlock } from "./map-block"
import { Rect } from "./rect"

const speed = 500
const gravity = 2500
const jumpSpeed = 800
const maxJumps = 2

export class Player {
  rect = new Rect(0, -300, 40)
  jumps = maxJumps
  xvel = 0
  yvel = 0

  update(dt: number, collider: Collider) {
    let xvel = 0
    if (["ArrowLeft", "KeyA"].some(isDown)) xvel -= speed
    if (["ArrowRight", "KeyR"].some(isDown)) xvel += speed

    this.xvel = xvel
    this.yvel += gravity * dt

    if (wasPressed("ArrowUp") && this.jumps > 0) {
      this.yvel = -jumpSpeed
      this.jumps -= 1
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

    for (const { normal } of collisions) {
      if (normal.x !== 0 && Math.sign(normal.x) !== Math.sign(this.xvel)) {
        this.xvel = 0
      }

      if (normal.y !== 0 && Math.sign(normal.y) !== Math.sign(this.yvel)) {
        this.yvel = 0
      }

      if (normal.y < 0) {
        this.jumps = maxJumps
      }
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.values)
  }
}
