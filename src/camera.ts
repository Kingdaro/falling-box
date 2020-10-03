import { canvas, context } from "./graphics"
import { lerpClamped } from "./math"

export class Camera {
  left = 0
  top = 0

  moveTowards(left: number, top: number, delta: number) {
    this.left = lerpClamped(this.left, left, delta)
    this.top = lerpClamped(this.top, top, delta)
  }

  apply(block: () => void) {
    context.save()
    context.translate(
      Math.round(-this.left + canvas.width / 2),
      Math.round(-this.top + canvas.height / 2),
    )
    block()
    context.restore()
  }
}
