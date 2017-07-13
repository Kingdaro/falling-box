// import * as pixi from 'pixi.js'
import { GameObject } from './game-object'

const gravity = 1200
const maxVelocity = 1000

export class FallingBlock extends GameObject {
  gravity = gravity
  life = 10

  update(dt: number) {
    this.applyGravity(dt)
    this.yvel = Math.min(this.yvel, maxVelocity)
    this.applyVelocity(dt)

    this.life -= dt
  }

  get active() {
    return this.life > 0
  }
}
