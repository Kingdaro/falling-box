import { createRect } from '../util/pixi'

export class GameObject {
  xvel = 0
  yvel = 0
  gravity = 0
  sprite = createRect(this.width, this.height)

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height = width
  ) {}

  applyGravity(dt: number) {
    this.yvel += this.gravity * dt
  }

  applyVelocity(dt: number) {
    this.x += this.xvel * dt
    this.y += this.yvel * dt
  }

  updateSprite() {
    this.sprite.position.set(this.x, this.y)
  }

  update(dt: number) {
    this.applyGravity(dt)
    this.applyVelocity(dt)
    this.updateSprite()
  }
}
