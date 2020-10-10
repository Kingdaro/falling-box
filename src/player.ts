import { Collider } from "./collision"
import { getAxis, isButtonDown, wasButtonPressed } from "./gamepad"
import { context } from "./graphics"
import { isDown, wasPressed } from "./keyboard"
import { MapBlock } from "./map-block"
import { Rect } from "./rect"
import { StaticBlock } from "./static-block"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const speed = 500
const gravity = 2600
const jumpSpeed = 900
const maxJumps = 2
const falloutDepth = 1000
const respawnHeight = 500
const grabDistance = 50

export class Player {
  rect = new Rect(vec(40))
  jumps = maxJumps
  velocity = vec()
  direction: 1 | -1 = 1

  constructor(
    private readonly collider: Collider,
    private readonly map: WorldMap,
  ) {
    collider.add(this, ...this.rect.values)
    this.respawn()
  }

  get grabPosition() {
    return this.rect.center.plus(vec(grabDistance * this.direction, 0))
  }

  respawn() {
    this.rect.position = vec(this.map.spawnPosition(), -respawnHeight)
    this.velocity = vec()
    this.collider.setPosition(this, this.rect.left, this.rect.top)
  }

  update(dt: number) {
    if (this.rect.top >= falloutDepth) {
      this.respawn()
      return
    }

    // set velocity for movement
    this.velocity = vec(movementValue() * speed, this.velocity.y)

    // apply gravity
    this.velocity = this.velocity.plus(vec(0, gravity * dt))

    // apply jumping velocity and subtract jumps
    if (hasJumped() && this.jumps > 0) {
      this.velocity = vec(this.velocity.x, -jumpSpeed)
      this.jumps -= 1
    }

    if (this.direction < 0 && movementValue() > 0) {
      this.direction = 1
    }
    if (this.direction > 0 && movementValue() < 0) {
      this.direction = -1
    }

    const targetPosition = this.rect.position.plus(this.velocity.times(dt))
    const [finalX, finalY, collisions] = this.collider.move(
      this,
      targetPosition.x,
      targetPosition.y,
      (other) => {
        if (other instanceof MapBlock || other instanceof StaticBlock)
          return "slide"
      },
    )
    this.rect.position = vec(finalX, finalY)

    let [xvel, yvel] = this.velocity.components()
    for (const { normal } of collisions) {
      if (normal.x !== 0 && Math.sign(normal.x) !== Math.sign(xvel)) xvel = 0
      if (normal.y !== 0 && Math.sign(normal.y) !== Math.sign(yvel)) yvel = 0
      if (normal.y < 0) this.jumps = maxJumps
    }
    this.velocity = vec(xvel, yvel)
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)

    context.save()

    context.globalAlpha = 0.3

    context.beginPath()
    context.arc(...this.grabPosition.rounded().components(), 3, 0, Math.PI * 2)
    context.closePath()
    context.fill()

    context.restore()
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
