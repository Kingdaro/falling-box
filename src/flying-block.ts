import { Entity } from "./entity"
import { mapBlockSize } from "./map-block"
import { Rect } from "./rect"
import {
  DrawRectTrait,
  RectTrait,
  TimedRemovalTrait,
  VelocityTrait,
} from "./traits"
import { vec, Vector } from "./vector"

const speed = 1000

export function createFlyingBlock(centerPosition: Vector, direction: 1 | -1) {
  return new Entity([
    new RectTrait(
      new Rect(vec(mapBlockSize), centerPosition.minus(mapBlockSize / 2)),
    ),
    new DrawRectTrait("green"),
    new VelocityTrait(vec(direction * speed, 0)),
    new TimedRemovalTrait(2),
  ])
}
