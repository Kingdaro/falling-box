import { context } from "./graphics"
import { Rect } from "./rect"

export const mapBlockSize = 50

export class MapBlock {
  readonly rect

  constructor(left: number, top: number, width: number, height: number) {
    this.rect = new Rect(
      left * mapBlockSize,
      top * mapBlockSize,
      width * mapBlockSize,
      height * mapBlockSize,
    )
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
