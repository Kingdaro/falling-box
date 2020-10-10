import { context, dimensions } from "./graphics"
import { lerpClamped } from "./math"
import { vec, Vector } from "./vector"

export class Camera {
  position = vec()

  moveTowards(position: Vector, delta: number) {
    this.position = vec(
      lerpClamped(this.position.x, position.x, delta),
      lerpClamped(this.position.y, position.y, delta),
    )
  }

  apply(block: () => void) {
    const translation = this.position
      .times(-1)
      .plus(dimensions().dividedBy(2))
      .rounded()

    context.save()
    context.translate(...translation.components())
    block()
    context.restore()
  }
}
