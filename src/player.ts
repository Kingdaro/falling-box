import { checkCollision } from "./collision"
import { EntityGroup } from "./entity"
import { getAxis, isButtonDown, wasButtonPressed } from "./gamepad"
import { context } from "./graphics"
import { compare } from "./helpers"
import { isDown, wasPressed } from "./keyboard"
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
  private readonly map
  private readonly staticBlocks

  constructor(map: WorldMap, staticBlocks: EntityGroup<StaticBlock>) {
    this.map = map
    this.staticBlocks = staticBlocks
    this.respawn()
  }

  get grabPosition() {
    return this.rect.center.plus(vec(grabDistance * this.direction, 0))
  }

  respawn() {
    this.rect.position = vec(this.map.spawnPosition(), -respawnHeight)
    this.velocity = vec()
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

    this.moveColliding(dt)
  }

  private moveColliding(dt: number) {
    const sortedByDistance = [...this.map.blocks, ...this.staticBlocks.entities]
      .slice()
      .sort(compare((block) => this.rect.center.distanceTo(block.rect.center)))

    let newRect = this.rect.withPosition(
      this.rect.position.plus(this.velocity.times(dt)),
    )
    let [xvel, yvel] = this.velocity.components()

    for (const block of sortedByDistance) {
      const collision = checkCollision(newRect, block.rect)
      if (collision) {
        const { displacement } = collision
        newRect = newRect.withPosition(newRect.position.plus(displacement))

        if (
          displacement.x !== 0 &&
          Math.sign(displacement.x) !== Math.sign(xvel)
        ) {
          xvel = 0
        }

        if (
          displacement.y !== 0 &&
          Math.sign(displacement.y) !== Math.sign(yvel)
        ) {
          yvel = 0
        }

        if (displacement.y < 0) this.jumps = maxJumps
      }
    }

    this.rect = newRect
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
