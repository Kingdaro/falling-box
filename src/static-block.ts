import { Entity } from "./entity"
import { mapBlockSize } from "./map-block"
import { Rect } from "./rect"
import { DrawRectTrait, RectTrait, Trait } from "./traits"
import { vec, Vector } from "./vector"

export function createStaticBlock(position: Vector) {
  return new Entity([
    new RectTrait(new Rect(vec(mapBlockSize), position)),
    new DrawRectTrait(),
    new TimedRemovalTrait(),
  ])
}

class TimedRemovalTrait implements Trait {
  time = 15

  update(entity: Entity, dt: number) {
    this.time -= dt
    if (this.time < 0) {
      entity.destroy()
    }
  }
}
