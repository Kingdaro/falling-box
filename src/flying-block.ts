import { Entity, EntityGroup } from "./entity"
import { mapBlockSize } from "./map-block"
import { Rect } from "./rect"
import {
  DrawRectTrait,
  RectTrait,
  TimedRemovalTrait,
  Trait,
  VelocityTrait,
} from "./traits"
import { vec, Vector } from "./vector"

const speed = 1000

export function createFlyingBlock(
  centerPosition: Vector,
  direction: 1 | -1,
  staticBlockGroup: EntityGroup,
) {
  return new Entity([
    new RectTrait(
      new Rect(vec(mapBlockSize), centerPosition.minus(mapBlockSize / 2)),
    ),
    new VelocityTrait(vec(direction * speed, 0)),
    new TimedRemovalTrait(2),
    new DestructionTrait(staticBlockGroup),
    new DrawRectTrait("green"),
  ])
}

class DestructionTrait implements Trait {
  hits = 3

  constructor(private readonly staticBlockGroup: EntityGroup) {}

  update(entity: Entity) {
    const { rect } = entity.get(RectTrait)

    const hitBlock = this.staticBlockGroup.entities.find((ent) =>
      ent.get(RectTrait).rect.intersects(rect),
    )

    if (hitBlock) {
      this.hits -= 1
      if (this.hits > 0) {
        hitBlock.destroy()
      } else {
        entity.destroy()
      }
    }
  }
}
