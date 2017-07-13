import * as pixi from 'pixi.js'
import { GameState, viewWidth, viewHeight } from './game'
import { Player, PlayerInput } from './player'
import { FallingBlock } from './falling-block'
import { GameObject } from './game-object'
import { lerpClamped, randomRange } from '../util/math'

const cameraStiffness = 10
const cameraVerticalOffset = 150
const fallingBlockSpawnHeight = -2000
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
    for (const { sprite } of this.worldBlocks) {
      this.worldContainer.addChild(sprite)
    }
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
    const { fallingBlocks, worldBlocks } = this

    for (const fb of fallingBlocks) {
      fb.update(dt)
      for (const wb of worldBlocks) fb.resolveCollision(wb)
    }

    const sortedByHeight = fallingBlocks.slice().sort((a, b) => a.y - b.y)
    for (var i = 0; i < sortedByHeight.length; i++) {
      for (var j = i; j < sortedByHeight.length; j++) {
        const first = sortedByHeight[i]
        const second = sortedByHeight[j]
        if (first !== second) first.resolveCollision(second)
      }
    }
  }

  updatePlayer(dt: number) {
    this.player.update(dt)

    if (this.player.y > worldFalloutDepth) {
      this.respawnPlayer()
    }

    const blocks = this.worldBlocks.concat(this.fallingBlocks)
    for (const b of blocks) {
      this.player.resolveCollision(b)
    }
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
