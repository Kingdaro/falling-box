// import * as pixi from 'pixi.js'
import { GameState, viewWidth } from './game'
import { Player, PlayerInput } from './player'
import { FallingBlock, blockSize } from './falling-block'
import { GameObject } from './game-object'

export class GameplayState extends GameState {
  player = new Player()
  playerInput = new PlayerInput(this.player)
  fallingBlocks = [] as FallingBlock[]
  worldBlocks = [] as GameObject[]

  enter() {
    this.stage.addChild(this.player.sprite)
    this.player.sprite.position.set(100, 100)

    this.createWorld()
    this.spawnFallingBlock()
  }

  createWorld() {
    this.worldBlocks.push(new GameObject(50, 400, 300, 50))
    this.worldBlocks.forEach(b => this.stage.addChild(b.sprite))
  }

  spawnFallingBlock() {
    const x = Math.random() * (viewWidth - blockSize)
    const block = new FallingBlock(x, -100)
    this.fallingBlocks.push(block)
    this.stage.addChild(block.sprite)
  }

  update(dt: number) {
    this.updatePlayer(dt)
    this.fallingBlocks.forEach(b => b.update(dt))
  }

  updatePlayer(dt: number) {
    this.player.update(dt)
    this.worldBlocks.forEach(b => this.player.resolveCollision(b))
    this.fallingBlocks.forEach(b => this.player.resolveCollision(b))
  }

  keydown(event: KeyboardEvent) {
    this.playerInput.keydown(event)
  }

  keyup(event: KeyboardEvent) {
    this.playerInput.keyup(event)
  }
}
