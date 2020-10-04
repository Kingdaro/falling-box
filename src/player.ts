import { Collider } from "./collision"
import { getAxis, isButtonDown, wasButtonPressed } from "./gamepad"
import { context } from "./graphics"
import { isDown, wasPressed } from "./keyboard"
import { MapBlock } from "./map-block"
import { randomRange } from "./math"
import { Rect } from "./rect"
import { StaticBlock } from "./static-block"
import { WorldMap } from "./world-map"

const speed = 500
const gravity = 2600
const jumpSpeed = 900
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
    this.rect.left = randomRange(map.left, map.right - this.rect.width)
    this.xvel = 0
    this.yvel = 0
    collider.setPosition(this, this.rect.left, this.rect.top)
  }

  update(dt: number, collider: Collider, map: WorldMap) {
    if (this.rect.top >= falloutDepth) {
      this.respawn(collider, map)
      return
    }

    this.xvel = movementValue() * speed
    this.yvel += gravity * dt

    if (hasJumped() && this.jumps > 0) {
      this.yvel = -jumpSpeed
      this.jumps -= 1
    }

    const [finalX, finalY, collisions] = collider.move(
      this,
      this.rect.left + this.xvel * dt,
      this.rect.top + this.yvel * dt,
      (other) => {
        if (other instanceof MapBlock || other instanceof StaticBlock)
          return "slide"
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

const movementValue = () => {
  const axis = getAxis("leftX")
  if (axis !== 0) return axis

  let value = 0
  if (isButtonDown("dpadLeft") || ["ArrowLeft", "KeyA"].some(isDown)) {
    value -= 1
  }
  if (isButtonDown("dpadRight") || ["ArrowRight", "KeyR"].some(isDown)) {
    value += 1
  }
  return value
}

const hasJumped = () => wasButtonPressed("a") || wasPressed("ArrowUp")
