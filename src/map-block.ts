import { context } from "./graphics"
import { Rect } from "./rect"
import { vec } from "./vector"

export const mapBlockSize = 50

export class MapBlock {
  readonly rect

  constructor(left: number, top: number, width: number, height: number) {
    this.rect = new Rect(
      vec(width, height).map((v) => v * mapBlockSize),
      vec(left, top).map((v) => v * mapBlockSize),
    )
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
