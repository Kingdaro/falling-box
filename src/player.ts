import { Entity, EntityGroup } from "./entity"
import { createFlyingBlock } from "./flying-block"
import {
  getAxis,
  isButtonDown,
  wasButtonPressed,
  wasButtonReleased,
} from "./gamepad"
import { context } from "./graphics"
import { isDown, wasPressed, wasReleased } from "./keyboard"
import { mapBlockSize } from "./map-block"
import { Rect } from "./rect"
import {
  CollisionTrait,
  DrawRectTrait,
  GravityTrait,
  RectTrait,
  Trait,
  VelocityResolutionTrait,
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

export function createPlayer(
  map: WorldMap,
  staticBlockGroup: EntityGroup,
  flyingBlockGroup: EntityGroup,
) {
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
    new VelocityResolutionTrait(),
    new RespawnOnFalloutTrait(map),
    new GrabTrait(staticBlockGroup, flyingBlockGroup),
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

    if (jumpInputPressed() && this.jumps > 0) {
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
  private grabbing = false

  constructor(
    private readonly staticBlockGroup: EntityGroup,
    private readonly flyingBlockGroup: EntityGroup,
  ) {}

  private getGrabPosition(ent: Entity) {
    const { rect } = ent.get(RectTrait)
    return rect.center.plus(vec(grabDistance * this.direction, 0))
  }

  update(ent: Entity) {
    const { velocity } = ent.get(VelocityTrait)
    if (velocity.x > 0 && this.direction < 0) {
      this.direction = 1
    }
    if (velocity.x < 0 && this.direction > 0) {
      this.direction = -1
    }

    const grabPosition = this.getGrabPosition(ent)

    if (grabInputPressed() && !this.grabbing) {
      const grabbed = this.staticBlockGroup.entities.find((ent) => {
        const { rect } = ent.get(RectTrait)
        return rect.containsPoint(grabPosition)
      })

      if (grabbed) {
        grabbed.destroy()
        this.grabbing = true
      }
    }

    if (grabInputReleased() && this.grabbing) {
      this.grabbing = false
      this.flyingBlockGroup.add(createFlyingBlock(grabPosition, this.direction))
    }
  }

  draw(ent: Entity) {
    const grabPosition = this.getGrabPosition(ent)

    context.save()

    if (this.grabbing) {
      context.fillStyle = "white"
      context.fillRect(
        ...grabPosition
          .minus(mapBlockSize / 2)
          .rounded()
          .components(),
        mapBlockSize,
        mapBlockSize,
      )
    } else {
      context.globalAlpha = 0.3

      context.beginPath()
      context.arc(...grabPosition.rounded().components(), 3, 0, Math.PI * 2)
      context.closePath()
      context.fill()
    }

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

const jumpInputPressed = () => wasButtonPressed("a") || wasPressed("ArrowUp")

const grabInputPressed = () =>
  wasPressed("KeyZ") || wasButtonPressed("x") || wasButtonPressed("b")

const grabInputReleased = () =>
  wasReleased("KeyZ") || wasButtonReleased("x") || wasButtonReleased("b")
