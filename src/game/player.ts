// import * as pixi from 'pixi.js'
import { lerpClamped } from '../util/math'
import { createRect } from '../util/pixi'
import { viewHeight } from './game'

const size = 50
const movementSpeed = 500
const movementStiffness = 15
const gravity = 2500
const jumpStrength = 800

export class Player {
  sprite = createRect(size)
  xvel = 0
  yvel = 0
  movement = 0

  update(dt: number) {
    this.xvel = lerpClamped(this.xvel, this.movement * movementSpeed, dt * movementStiffness)
    this.yvel += gravity * dt

    this.sprite.x += this.xvel * dt
    this.sprite.y += this.yvel * dt

    if (this.sprite.y + this.sprite.height > viewHeight) {
      this.sprite.y = viewHeight - this.sprite.height
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
    if (event.key === 'ArrowLeft' && this.player.movement < 0) this.player.movement = 0
    if (event.key === 'ArrowRight' && this.player.movement > 0) this.player.movement = 0
  }
}
