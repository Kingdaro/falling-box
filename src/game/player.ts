// import * as pixi from 'pixi.js'
import { lerpClamped } from '../util/math'
import { viewHeight } from './game'
import { GameObject } from './game-object'

const playerSize = 50
const movementSpeed = 500
const movementStiffness = 15
const gravity = 2500
const jumpStrength = 800

export class Player extends GameObject {
  movement = 0
  gravity = gravity

  constructor() {
    super(100, 100, playerSize)
  }

  update(dt: number) {
    this.xvel = lerpClamped(
      this.xvel,
      this.movement * movementSpeed,
      dt * movementStiffness
    )

    this.applyGravity(dt)
    this.applyVelocity(dt)

    if (this.y + this.height > viewHeight) {
      this.y = viewHeight - this.height
    }
  }

  jump() {
    this.yvel = -jumpStrength
  }
}

export class PlayerInput {
  constructor(private player: Player) {}

  keydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') this.player.jump()
    if (event.key === 'ArrowLeft') this.player.movement = -1
    if (event.key === 'ArrowRight') this.player.movement = 1
  }

  keyup(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.player.movement < 0) {
      this.player.movement = 0
    }
    if (event.key === 'ArrowRight' && this.player.movement > 0) {
      this.player.movement = 0
    }
  }
}
