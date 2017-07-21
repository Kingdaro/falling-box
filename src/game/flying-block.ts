import { GameObject } from './game-object'
import { worldScale } from './world'

const speed = 1000

export class FlyingBlock extends GameObject {
  life = 2
  hits = 3
  freezeTime = 0

  constructor(x: number, y: number, direction: number) {
    super(x, y, worldScale)
    this.xvel = speed * direction
  }

  update(dt: number) {
    this.freezeTime -= dt
    if (this.freezeTime <= 0) {
      super.update(dt)
      this.life -= dt
    }
  }

  draw(graphics: CanvasRenderingContext2D) {
    graphics.save()
    graphics.fillStyle = 'green'
    super.draw(graphics)
    graphics.restore()
  }
}
