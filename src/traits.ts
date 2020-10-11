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
  constructor(public rect: Rect) {}
}

export class DrawRectTrait implements Trait {
  constructor(public color = "white") {}

  draw(ent: Entity) {
    const { rect } = ent.get(RectTrait)
    context.fillStyle = "white"
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
  constructor(public amount: number) {}

  update(ent: Entity, dt: number) {
    const velocityTrait = ent.get(VelocityTrait)
    const { velocity } = velocityTrait
    velocityTrait.velocity = vec(velocity.x, velocity.y + this.amount * dt)
  }
}

export class CollisionTrait implements Trait {
  collisions: Collision[] = []

  constructor(public getTargets: () => readonly Entity[]) {}

  update(self: Entity) {
    const rectTrait = self.get(RectTrait)
    const velTrait = self.get(VelocityTrait)

    const distanceToSelf = (entity: Entity) =>
      rectTrait.rect.center.distanceTo(entity.get(RectTrait).rect.center)

    const sortedByDistance = this.getTargets()
      .slice()
      .sort(compare(distanceToSelf))

    let newRect = rectTrait.rect
    let [xvel, yvel] = velTrait.velocity.components()
    const collisions: Collision[] = []

    for (const entity of sortedByDistance) {
      const { rect: otherRect } = entity.get(RectTrait)
      const collision = checkCollision(newRect, otherRect)
      if (collision) {
        collisions.push(collision)

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
      }
    }

    rectTrait.rect = newRect
    velTrait.velocity = vec(xvel, yvel)
    this.collisions = collisions
  }
}
