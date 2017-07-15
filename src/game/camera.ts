import { lerpClamped } from '../util/math'

export class Camera {
  x = 0
  y = 0

  panTo(x: number, y: number, delta: number) {
    this.x = lerpClamped(this.x, x, delta)
    this.y = lerpClamped(this.y, y, delta)
  }

  applyTransform(ctx: CanvasRenderingContext2D, drawFunction: () => any) {
    ctx.save()
    ctx.translate(Math.round(this.x), Math.round(this.y))
    drawFunction()
    ctx.restore()
  }
}
