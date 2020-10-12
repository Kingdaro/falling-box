import { checkCollision, Collision } from "./collision"
import { Entity } from "./entity"
import { context } from "./graphics"
import { compare } from "./helpers"
import { Rect } from "./rect"
import { vec } from "./vector"

export interface Trait {
  update?(_entity: Entity, _dt: number): void
  draw?(_entity: Entity): void
}

export class RectTrait {
  // TODO: simplify this by taking the args for Rect instead of a rect
  constructor(public rect: Rect) {}
}

export class DrawRectTrait implements Trait {
  constructor(public color = "white") {}

  draw(ent: Entity) {
    const { rect } = ent.get(RectTrait)
    context.fillStyle = this.color
    context.fillRect(...rect.valuesRounded)
  }
}

export class VelocityTrait implements Trait {
  constructor(public velocity = vec(0, 0)) {}

  update(ent: Entity, dt: number) {
    const { rect } = ent.get(RectTrait)
    rect.position = rect.position.plus(this.velocity.times(dt))
  }
}

export class GravityTrait implements Trait {
  constructor(public amount: number, public terminalVelocity = Infinity) {}

  update(ent: Entity, dt: number) {
    const velocityTrait = ent.get(VelocityTrait)
    const { velocity } = velocityTrait
    velocityTrait.velocity = vec(
      velocity.x,
      Math.min(velocity.y + this.amount * dt, this.terminalVelocity),
    )
  }
}

export class CollisionTrait implements Trait {
  // we have this array so that other traits can use the collision info and do stuff with it,
  // e.g. resolve velocity, reset jumps, or something else
  // this _may_ make the traits order-dependent in the entity,
  // which is kind of unwieldy.
  // it might be better to turn this into an event emitter that triggers on collisions,
  // then add lifecycle callbacks to traits so they can listen on init, then clean up the listener
  // maybe maybe
  collisions: Collision[] = []

  constructor(public getTargets: () => readonly Entity[]) {}

  update(self: Entity) {
    const rectTrait = self.get(RectTrait)

    const distanceToSelf = (entity: Entity) =>
      rectTrait.rect.center.distanceTo(entity.get(RectTrait).rect.center)

    const sortedByDistance = this.getTargets()
      .slice()
      .sort(compare(distanceToSelf))

    let newRect = rectTrait.rect
    const collisions: Collision[] = []

    for (const entity of sortedByDistance) {
      if (entity === self) continue

      const { rect: otherRect } = entity.get(RectTrait)
      const collision = checkCollision(newRect, otherRect)
      if (collision) {
        newRect = newRect.withPosition(
          newRect.position.plus(collision.displacement),
        )
        collisions.push(collision)
      }
    }

    rectTrait.rect = newRect
    this.collisions = collisions
  }
}

export class VelocityResolutionTrait implements Trait {
  update(entity: Entity) {
    const { collisions } = entity.get(CollisionTrait)
    const velocityTrait = entity.get(VelocityTrait)
    let [xvel, yvel] = velocityTrait.velocity.components()

    for (const { displacement } of collisions) {
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
    }

    velocityTrait.velocity = vec(xvel, yvel)
  }
}

export class TimedRemovalTrait implements Trait {
  constructor(private time: number) {}

  update(entity: Entity, dt: number) {
    this.time -= dt
    if (this.time < 0) {
      entity.destroy()
    }
  }
}
