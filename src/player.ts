import { Collider } from "./collision"
import { context } from "./graphics"
import { isDown, wasPressed } from "./keyboard"
import { MapBlock } from "./map-block"
import { randomRange } from "./math"
import { Rect } from "./rect"
import { WorldMap } from "./world-map"

const speed = 500
const gravity = 2500
const jumpSpeed = 800
const maxJumps = 2
const falloutDepth = 1000
const respawnHeight = 500

export class Player {
  rect = new Rect(0, 0, 40)
  jumps = maxJumps
  xvel = 0
  yvel = 0

  constructor(collider: Collider, map: WorldMap) {
    collider.add(this, ...this.rect.values)
    this.respawn(collider, map)
  }

  respawn(collider: Collider, map: WorldMap) {
    this.rect.top = -respawnHeight
    this.rect.left = randomRange(map.left, map.right)
    this.xvel = 0
    this.yvel = 0
    collider.setPosition(this, this.rect.left, this.rect.top)
  }

  update(dt: number, collider: Collider, map: WorldMap) {
    if (this.rect.top >= falloutDepth) {
      this.respawn(collider, map)
      return
    }

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
    context.fillRect(...this.rect.valuesRounded)
  }
}
