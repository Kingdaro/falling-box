// import * as pixi from 'pixi.js'
import { GameState, viewWidth } from './game'
import { Player, PlayerInput } from './player'
import { FallingBlock } from './falling-block'
import { GameObject } from './game-object'

const worldScale = 70

export class GameplayState extends GameState {
  player = new Player()
  playerInput = new PlayerInput(this.player)
  fallingBlocks = [] as FallingBlock[]
  worldBlocks = [] as GameObject[]

  enter() {
    this.stage.addChild(this.player.sprite)
    this.player.x = 100
    this.player.y = -100

    this.createWorld()
    this.spawnFallingBlock()
  }

  addWorldBlock(wx: number, wy: number, wwidth: number, wheight: number) {
    this.worldBlocks.push(
      new GameObject(
        wx * worldScale,
        wy * worldScale,
        wwidth * worldScale,
        wheight * worldScale
      )
    )
  }

  createWorld() {
    this.addWorldBlock(0, 0, 20, 1)
    this.addWorldBlock(1, 1, 18, 1)
    this.addWorldBlock(2, 2, 16, 1)
    this.worldBlocks.forEach(b => this.stage.addChild(b.sprite))
  }

  spawnFallingBlock() {
    const x = Math.random() * (viewWidth - worldScale)
    const block = new FallingBlock(x, -100, worldScale)
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
