// import * as pixi from 'pixi.js'
import { GameObject } from './game-object'
import { worldScale } from './world'

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

  constructor(x: number, y: number) {
    super(x, y, worldScale)
  }

  update(dt: number) {
    if (this.hasVelocity) {
      this.applyGravity(dt)
      this.yvel = Math.min(this.yvel, maxVelocity)
      this.applyVelocity(dt)
    }
    this.life -= dt

    if (this.life < 0) {
      this.state = FallingBlockState.leaving
    }
  }

  get isFalling() {
    return this.state === FallingBlockState.falling
  }

  get isFrozen() {
    return this.state === FallingBlockState.frozen
  }

  get isSolid() {
    return (
      this.state === FallingBlockState.falling ||
      this.state === FallingBlockState.frozen
    )
  }

  get hasVelocity() {
    return (
      this.state === FallingBlockState.falling ||
      this.state === FallingBlockState.leaving
    )
  }
}
