import { lerpClamped } from '../util/math'
import { GameObject } from './game-object'
import { FallingBlock } from './falling-block'

const playerSize = 50
const movementSpeed = 500
const movementStiffness = 15
const gravity = 2500
const jumpStrength = 800

export class Player extends GameObject {
  direction = 1
  movement = 0
  gravity = gravity

  constructor() {
    super(0, 0, playerSize)
  }

  update(dt: number) {
    this.xvel = lerpClamped(
      this.xvel,
      this.direction * this.movement * movementSpeed,
      dt * movementStiffness,
    )

    this.applyGravity(dt)
    this.applyVelocity(dt)
  }

  jump() {
    this.yvel = -jumpStrength
  }

  checkSquish(blocks: FallingBlock[]) {
    return blocks.filter(block => block.isFalling).some(block => {
      const disp = this.getDisplacement(block)
      const collides = this.collidesWith(block)
      return (
        collides &&
        Math.abs(disp.x) > this.width * 0.8 &&
        Math.abs(disp.y) > this.height / 2
      )
    })
  }
}

export class PlayerInput {
  constructor(private player: Player) {}

  keydown(event: KeyboardEvent) {
    const { player } = this
    if (event.key === 'ArrowLeft') {
      player.direction = -1
      player.movement = 1
    }
    if (event.key === 'ArrowRight') {
      player.direction = 1
      player.movement = 1
    }
    if (event.key === 'ArrowUp') {
      player.jump()
    }
  }

  keyup(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.player.direction < 0) {
      this.player.movement = 0
    }
    if (event.key === 'ArrowRight' && this.player.direction > 0) {
      this.player.movement = 0
    }
  }
}
