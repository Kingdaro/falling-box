// import * as pixi from 'pixi.js'
import { GameObject } from './game-object'

const gravity = 1200
const maxVelocity = 1000

export class FallingBlock extends GameObject {
  gravity = gravity

  update(dt: number) {
    this.applyGravity(dt)
    this.yvel = Math.min(this.yvel, maxVelocity)
    this.applyVelocity(dt)
  }
}
