import { Collider } from "./collision"
import { context } from "./graphics"
import { mapBlockSize } from "./map-block"
import { Rect } from "./rect"

export class StaticBlock {
  rect

  constructor(collider: Collider, x: number, y: number) {
    this.rect = new Rect(x, y, mapBlockSize)

    const [left, top, width, height] = this.rect.values
    collider.add(this, left, top, width - 1, height - 1)
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
