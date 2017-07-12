import * as pixi from 'pixi.js'

export const size = 70
export const gravity = 1200

export class FallingBlock {
  sprite = new pixi.Graphics()
  xvel = 0
  yvel = 0

  constructor(x: number, y: number) {
    this.sprite.beginFill(0xffffff)
    this.sprite.drawRect(0, 0, size, size)
    this.sprite.endFill()
    this.sprite.position.set(x, y)
  }

  update(dt: number) {
    this.yvel += gravity * dt

    this.sprite.x += this.xvel * dt
    this.sprite.y += this.yvel * dt
  }
}
