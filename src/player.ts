import { Entity, EntityGroup } from "./entity"
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

const size = 40
const gravity = 2600
const speed = 500
const jumpSpeed = 900
const maxJumps = 2
const falloutDepth = 1000
const respawnHeight = 500
const grabDistance = 50

export function createPlayer(map: WorldMap, staticBlockGroup: EntityGroup) {
  return new Entity([
    new RectTrait(
      new Rect(vec(size), vec(map.getRespawnPosition(), -respawnHeight)),
    ),
    new DrawRectTrait(),
    new MovementTrait(),
    new JumpingTrait(),
    new VelocityTrait(),
    new GravityTrait(gravity),
    new CollisionTrait(() => [...map.entities, ...staticBlockGroup.entities]),
    new RespawnOnFalloutTrait(map),
    new GrabTrait(),
  ])
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
