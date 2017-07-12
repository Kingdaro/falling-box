import * as pixi from 'pixi.js'
import { GameState, viewWidth, viewHeight } from './game'
import { Player, PlayerInput } from './player'
import { FallingBlock } from './falling-block'
import { GameObject } from './game-object'
import { lerpClamped, randomRange } from '../util/math'

const worldScale = 70
const cameraStiffness = 10
const cameraVerticalOffset = 150

export class GameplayState extends GameState {
  player = new Player()
  playerInput = new PlayerInput(this.player)
  worldBlocks = [] as GameObject[]
  fallingBlocks = [] as FallingBlock[]

  worldContainer = new pixi.Container()

  enter() {
    this.stage.addChild(this.worldContainer)

    this.worldContainer.addChild(this.player.sprite)
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
    this.worldBlocks.forEach(b => this.worldContainer.addChild(b.sprite))
  }

  spawnFallingBlock() {
    const x = randomRange(0, 19) * worldScale
    const block = new FallingBlock(x, -500, worldScale)
    this.fallingBlocks.push(block)
    this.worldContainer.addChild(block.sprite)
  }

  update(dt: number) {
    this.updateFallingBlocks(dt)
    this.updatePlayer(dt)
    this.updateCamera(dt)
  }

  updateFallingBlocks(dt: number) {
    this.fallingBlocks.forEach(fb => {
      fb.update(dt)
      this.worldBlocks.forEach(wb => fb.resolveCollision(wb))
    })
  }

  updatePlayer(dt: number) {
    this.player.update(dt)
    this.worldBlocks.forEach(b => this.player.resolveCollision(b))
    this.fallingBlocks.forEach(b => this.player.resolveCollision(b))
  }

  updateCamera(dt: number) {
    const xTarget = -this.player.center.x + viewWidth / 2
    const yTarget =
      -this.player.center.y + viewHeight / 2 + cameraVerticalOffset

    this.worldContainer.position.set(
      lerpClamped(this.worldContainer.x, xTarget, dt * cameraStiffness),
      lerpClamped(this.worldContainer.y, yTarget, dt * cameraStiffness)
    )
  }

  keydown(event: KeyboardEvent) {
    this.playerInput.keydown(event)
  }

  keyup(event: KeyboardEvent) {
    this.playerInput.keyup(event)
  }
}
