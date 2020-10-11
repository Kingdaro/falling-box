import { Entity } from "./entity"
import { getAxis, isButtonDown, wasButtonPressed } from "./gamepad"
import { context } from "./graphics"
import { isDown, wasPressed } from "./keyboard"
import { Rect } from "./rect"
import {
  CollisionTrait,
  DrawRectTrait,
  GravityTrait,
  RectTrait,
  Trait,
  VelocityTrait,
} from "./traits"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const speed = 500
const gravity = 2600
const jumpSpeed = 900
const maxJumps = 2
const falloutDepth = 1000
const respawnHeight = 500
const grabDistance = 50

export class Player extends Entity {
  constructor(map: WorldMap) {
    super([
      new RectTrait(new Rect(vec(40), vec(map.getRespawnPosition(), -800))),
      new DrawRectTrait(),
      new MovementTrait(),
      new JumpingTrait(),
      new VelocityTrait(),
      new GravityTrait(gravity),
      new CollisionTrait(() => [...map.entities]),
      new RespawnOnFalloutTrait(map),
      new GrabTrait(),
    ])
  }
}

class MovementTrait implements Trait {
  update(ent: Entity) {
    const velocityTrait = ent.get(VelocityTrait)
    velocityTrait.velocity = vec(
      movementValue() * speed,
      velocityTrait.velocity.y,
    )
  }
}

class JumpingTrait implements Trait {
  jumps = maxJumps

  update(entity: Entity) {
    const { collisions } = entity.get(CollisionTrait)
    const { velocity } = entity.get(VelocityTrait)

    if (collisions.some((col) => col.displacement.y < 0)) {
      this.jumps = maxJumps
    }

    if (hasJumped() && this.jumps > 0) {
      entity.get(VelocityTrait).velocity = vec(velocity.x, -jumpSpeed)
      this.jumps -= 1
    }
  }
}

class RespawnOnFalloutTrait implements Trait {
  constructor(private readonly map: WorldMap) {}

  update(ent: Entity) {
    const { rect } = ent.get(RectTrait)
    const velTrait = ent.get(VelocityTrait)

    if (rect.top > falloutDepth) {
      rect.position = vec(this.map.getRespawnPosition(), -respawnHeight)
      velTrait.velocity = vec()
    }
  }
}

class GrabTrait implements Trait {
  private direction: 1 | -1 = 1

  update(ent: Entity) {
    const { velocity } = ent.get(VelocityTrait)
    if (velocity.x > 0 && this.direction < 0) {
      this.direction = 1
    }
    if (velocity.x < 0 && this.direction > 0) {
      this.direction = -1
    }
  }

  draw(ent: Entity) {
    const { rect } = ent.get(RectTrait)
    const grabPosition = rect.center.plus(vec(grabDistance * this.direction, 0))

    context.save()

    context.globalAlpha = 0.3

    context.beginPath()
    context.arc(...grabPosition.rounded().components(), 3, 0, Math.PI * 2)
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

/* 
export class Player extends Entity {
  rect = new Rect(vec(40))
  jumps = maxJumps
  velocity = vec()
  direction: 1 | -1 = 1
  private readonly map

  constructor(map: WorldMap) {
    super([
      new RectTrait(new Rect(vec(40), vec(0, -800))),
      new DrawRectTrait()
    ])

    this.map = map
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
    const sortedByDistance = this.map.entities
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
 */
