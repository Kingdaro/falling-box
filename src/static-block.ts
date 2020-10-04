import { Collider } from "./collision"
import { Entity } from "./entity"
import { context } from "./graphics"
import { mapBlockSize } from "./map-block"
import { Rect } from "./rect"

export class StaticBlock extends Entity {
  rect

  constructor(private readonly collider: Collider, x: number, y: number) {
    super()
    this.rect = new Rect(x, y, mapBlockSize)
  }

  onAdded() {
    const [left, top, width, height] = this.rect.values
    this.collider.add(this, left, top, width - 1, height)
  }

  onRemoved() {
    this.collider.remove(this)
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
