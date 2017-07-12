import * as pixi from 'pixi.js'
import { GameState, InteractionEvent } from './game'

class Player {
  sprite = new pixi.Graphics()
  xvel = 0
  yvel = 0
  speed = 500
  movement = 0

  constructor() {
    this.sprite.beginFill(0xffffff)
    this.sprite.drawRect(0, 0, 50, 50)
    this.sprite.endFill()
  }

  update(dt: number) {
    this.xvel = this.movement * this.speed
    this.yvel += 2500 * dt

    this.sprite.x += this.xvel * dt
    this.sprite.y += this.yvel * dt

    if (this.sprite.y + this.sprite.height > 720) {
      this.sprite.y = 720 - this.sprite.height
    }
  }

  jump() {
    this.yvel = -800
  }
}

class PlayerInput {
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

export class GameplayState extends GameState {
  player = new Player()
  playerInput = new PlayerInput(this.player)

  enter() {
    this.stage.addChild(this.player.sprite)
    this.player.sprite.position.set(100, 100)
  }

  update(dt: number) {
    this.player.update(dt)
  }

  keydown(event: KeyboardEvent) {
    this.playerInput.keydown(event)
  }

  keyup(event: KeyboardEvent) {
    this.playerInput.keyup(event)
  }
}
