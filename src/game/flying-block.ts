import { GameObject } from './game-object'
import { worldScale } from './world'
import { FallingBlock } from './falling-block'

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

  handleCollisions(fallingBlocks: FallingBlock[]) {
    if (this.hits > 0 && this.freezeTime <= 0) {
      const hit = fallingBlocks.find(falling => this.collidesWith(falling))
      if (hit != null) {
        hit.life = -1
        this.hits -= 1
        this.freezeTime = 0.1
      }
    }
  }

  draw(graphics: CanvasRenderingContext2D) {
    graphics.save()
    graphics.fillStyle = 'green'
    super.draw(graphics)
    graphics.restore()
  }
}
