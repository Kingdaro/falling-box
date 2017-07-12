import * as pixi from 'pixi.js'
import { GameState } from './game'

class Player {
  sprite = new pixi.Graphics()

  constructor() {
    this.sprite.beginFill(0xffffff)
    this.sprite.drawRect(0, 0, 50, 50)
    this.sprite.endFill()
  }
}

export class GameplayState extends GameState {
  player = new Player()

  enter() {
    this.stage.addChild(this.player.sprite)
    this.player.sprite.position.set(100, 100)
  }

  update(dt: number) {
    this.player.sprite.x += 100 * dt
  }
}
