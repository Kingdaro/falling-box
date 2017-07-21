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
    const flying = this
    if (flying.hits > 0 && flying.freezeTime <= 0) {
      const collidables = fallingBlocks
      const hit = collidables.find(falling => flying.collidesWith(falling))
      if (hit != null) {
        hit.life = -1
        flying.hits -= 1
        flying.freezeTime = 0.1
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
