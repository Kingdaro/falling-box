// import * as pixi from 'pixi.js'
import { GameObject } from './game-object'

const gravity = 1200
const maxVelocity = 800

export enum FallingBlockState {
  falling,
  frozen,
  leaving,
}

export class FallingBlock extends GameObject {
  gravity = gravity
  state = FallingBlockState.falling
  life = 10

  update(dt: number) {
    if (
      this.state === FallingBlockState.falling ||
      this.state === FallingBlockState.leaving
    ) {
      this.applyGravity(dt)
      this.yvel = Math.min(this.yvel, maxVelocity)
      this.applyVelocity(dt)
    }
    this.life -= dt

    if (this.life < 0) {
      this.state = FallingBlockState.leaving
    }
  }

  get isSolid() {
    return (
      this.state === FallingBlockState.falling ||
      this.state === FallingBlockState.frozen
    )
  }
}
