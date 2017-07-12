// import * as pixi from 'pixi.js'
import { GameState } from './game'
import { Player, PlayerInput } from './player'

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
