import { Entity } from "./entity"
import { Rect } from "./rect"
import { DrawRectTrait, RectTrait } from "./traits"
import { vec } from "./vector"

export const mapBlockSize = 50

export class MapBlock extends Entity {
  constructor(left: number, top: number, width: number, height: number) {
    super([
      new RectTrait(
        new Rect(
          vec(width, height).map((v) => v * mapBlockSize),
          vec(left, top).map((v) => v * mapBlockSize),
        ),
      ),
      new DrawRectTrait(),
    ])
  }

  get rect() {
    return this.get(RectTrait).rect
  }
}
