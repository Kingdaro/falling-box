// import * as pixi from 'pixi.js'
import { GameState, viewWidth } from './game'
import { Player, PlayerInput } from './player'
import { FallingBlock, size as blockSize } from './falling-block'

export class GameplayState extends GameState {
  player = new Player()
  playerInput = new PlayerInput(this.player)
  blocks = [] as FallingBlock[]

  enter() {
    this.stage.addChild(this.player.sprite)
    this.player.sprite.position.set(100, 100)

    const block = new FallingBlock(Math.random() * (viewWidth - blockSize), -100)
    this.blocks.push(block)
    this.stage.addChild(block.sprite)
  }

  update(dt: number) {
    this.player.update(dt)
    this.blocks.forEach(b => b.update(dt))
  }

  keydown(event: KeyboardEvent) {
    this.playerInput.keydown(event)
  }

  keyup(event: KeyboardEvent) {
    this.playerInput.keyup(event)
  }
}
