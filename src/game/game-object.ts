import * as pixi from 'pixi.js'
import { createRect } from '../util/pixi'

export class GameObject {
  xvel = 0
  yvel = 0
  gravity = 0
  sprite: pixi.Graphics

  constructor(x: number, y: number, width: number, height = width) {
    this.sprite = createRect(width, height)
    this.sprite.position.set(x, y)
  }

  get x() {
    return this.sprite.x
  }

  set x(value: number) {
    this.sprite.x = value
  }

  get y() {
    return this.sprite.y
  }

  set y(value: number) {
    this.sprite.y = value
  }

  get width() {
    return this.sprite.width
  }

  set width(value: number) {
    this.sprite.x = value
  }

  get height() {
    return this.sprite.height
  }

  set height(value: number) {
    this.sprite.x = value
  }

  get center() {
    const x = this.x + this.width / 2
    const y = this.y + this.height / 2
    return { x, y }
  }

  applyGravity(dt: number) {
    this.yvel += this.gravity * dt
  }

  applyVelocity(dt: number) {
    this.x += this.xvel * dt
    this.y += this.yvel * dt
  }

  update(dt: number) {
    this.applyGravity(dt)
    this.applyVelocity(dt)
  }

  collidesWith(other: GameObject) {
    return (
      this.x + this.width > other.x &&
      this.x < other.x + other.width &&
      this.y + this.height > other.y &&
      this.y < other.y + other.height
    )
  }

  resolveCollision(other: GameObject) {
    if (!this.collidesWith(other)) return

    const dx =
      this.center.x < other.center.x
        ? other.x - (this.x + this.width)
        : other.x + other.width - this.x

    const dy =
      this.center.y < other.center.y
        ? other.y - (this.y + this.height)
        : other.y + other.height - this.y

    if (Math.abs(dx) < Math.abs(dy)) {
      this.x += dx
      if (this.xvel !== 0 && Math.sign(this.xvel) !== Math.sign(dx))
        this.xvel = 0
    } else {
      this.y += dy
      if (this.yvel !== 0 && Math.sign(this.yvel) !== Math.sign(dy))
        this.yvel = 0
    }
  }
}
