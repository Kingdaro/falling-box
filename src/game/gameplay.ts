import * as pixi from 'pixi.js'
import { GameState, viewWidth, viewHeight } from './game'
import { Player, PlayerInput } from './player'
import { FallingBlock } from './falling-block'
import { GameObject } from './game-object'
import { lerpClamped, randomRange } from '../util/math'

const cameraStiffness = 10
const cameraVerticalOffset = 150
const fallingBlockSpawnHeight = -800
const playerSpawnHeight = -300
const worldFalloutDepth = 1000
const worldScale = 70

export class GameplayState extends GameState {
  player = new Player()
  playerInput = new PlayerInput(this.player)
  worldBlocks = [] as GameObject[]
  fallingBlocks = [] as FallingBlock[]
  blockSpawnTimer = 0

  worldContainer = new pixi.Container()

  enter() {
    this.stage.addChild(this.worldContainer)
    this.worldContainer.addChild(this.player.sprite)
    this.respawnPlayer()
    this.createWorld()
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
    this.addWorldBlock(0, 0, 30, 1)
    this.addWorldBlock(1, 1, 28, 1)
    this.addWorldBlock(2, 2, 26, 1)
    this.worldBlocks.forEach(b => this.worldContainer.addChild(b.sprite))
  }

  spawnFallingBlock() {
    const x = randomRange(0, 19) * worldScale
    const block = new FallingBlock(x, fallingBlockSpawnHeight, worldScale)
    this.fallingBlocks.push(block)
    this.worldContainer.addChild(block.sprite)
  }

  respawnPlayer() {
    this.player.x = randomRange(0, 19) * worldScale
    this.player.y = playerSpawnHeight
    this.player.xvel = 0
    this.player.yvel = 0
  }

  update(dt: number) {
    this.updateFallingBlocks(dt)
    this.updatePlayer(dt)
    this.updateCamera(dt)

    this.blockSpawnTimer -= dt
    while (this.blockSpawnTimer <= 0) {
      this.blockSpawnTimer += 0.3
      this.spawnFallingBlock()
    }
  }

  updateFallingBlocks(dt: number) {
    this.fallingBlocks.forEach(fb => {
      fb.update(dt)
      this.worldBlocks.forEach(wb => fb.resolveCollision(wb))
      this.fallingBlocks.forEach(other => {
        if (fb !== other) {
          fb.resolveCollision(other)
        }
      })
    })
  }

  updatePlayer(dt: number) {
    this.player.update(dt)

    if (this.player.y > worldFalloutDepth) {
      this.respawnPlayer()
    }

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
