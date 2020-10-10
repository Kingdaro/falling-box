import { Collider } from "./collision"
import { Entity } from "./entity"
import { context } from "./graphics"
import { mapBlockSize } from "./map-block"
import { Rect } from "./rect"
import { vec, Vector } from "./vector"

export class StaticBlock extends Entity {
  rect
  life = 15

  constructor(private readonly collider: Collider, position: Vector) {
    super()
    this.rect = new Rect(vec(mapBlockSize), position)
  }

  onAdded() {
    const [left, top, width, height] = this.rect.values
    this.collider.add(this, left, top, width - 1, height)
  }

  onRemoved() {
    this.collider.remove(this)
  }

  update(dt: number) {
    this.life -= dt
    if (this.life <= 0) {
      this.destroy()
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.valuesRounded)
  }
}
