import { lerpClamped, randomRange } from '../util/math'
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
  holdingBlock = false
  color = `hsl(${randomRange(0, 360)}, 70%, 70%)`
  alive = true
  spawnTime = 0

  constructor() {
    super(0, 0, playerSize)
  }

  get grabPosition() {
    const x = this.center.x + (this.width / 2 + 25) * this.direction
    const y = this.center.y
    return { x, y }
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

  findGrabbedBlock(blocks: FallingBlock[]) {
    const { x, y } = this.grabPosition
    return blocks.findIndex(block => block.testPoint(x, y))
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

  draw(graphics: CanvasRenderingContext2D) {
    if (!this.alive) return

    super.draw(graphics)

    if (this.holdingBlock) {
      this.drawHeldBlock(graphics)
    } else {
      this.drawDirectionalIndicator(graphics)
    }
  }

  drawDirectionalIndicator(graphics: CanvasRenderingContext2D) {
    const { x, y } = this.grabPosition
    graphics.fillStyle = this.color
    graphics.beginPath()
    graphics.arc(x, y, 4, 0, Math.PI * 2)
    graphics.fill()
  }

  drawHeldBlock(graphics: CanvasRenderingContext2D) {
    const x = this.center.x + (this.width / 2 + 40) * this.direction
    const y = this.center.y
    graphics.fillStyle = this.color
    graphics.fillRect(x - 35, y - 35, 70, 70)
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
