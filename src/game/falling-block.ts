// import * as pixi from 'pixi.js'
import { createRect } from '../util/pixi'

export const size = 70
export const gravity = 1200

export class FallingBlock {
  sprite = createRect(size)
  xvel = 0
  yvel = 0

  constructor(x: number, y: number) {
    this.sprite.position.set(x, y)
  }

  update(dt: number) {
    this.yvel += gravity * dt

    this.sprite.x += this.xvel * dt
    this.sprite.y += this.yvel * dt
  }
}
