import { GameState, viewWidth, viewHeight } from './game'
import { Player, PlayerInput } from './player'
import { FallingBlock } from './falling-block'
import { randomRange } from '../util/math'
import { World, worldScale } from './world'
import { Camera } from './camera'
import { Timer } from './timer'

const cameraStiffness = 10
const cameraVerticalOffset = 150
const fallingBlockSpawnHeight = -2000
const playerSpawnHeight = -500
const worldFalloutDepth = 1000

export class GameplayState extends GameState {
  player = new Player()
  playerInput = new PlayerInput(this.player)
  world = new World()
  fallingBlocks = [] as FallingBlock[]
  camera = new Camera()
  blockSpawnTimer = new Timer(0.5)

  enter() {
    this.createWorld()
    this.respawnPlayer()
  }

  createWorld() {
    this.world.addBlock(0, 0, 30, 1)
    this.world.addBlock(1, 1, 28, 1)
    this.world.addBlock(2, 2, 26, 1)
  }

  respawnPlayer() {
    this.player.x = randomRange(0, this.world.bounds.right)
    this.player.y = playerSpawnHeight
    this.player.xvel = 0
    this.player.yvel = 0
  }

  spawnFallingBlock() {
    const x =
      Math.floor(randomRange(0, this.world.bounds.right) / worldScale) *
      worldScale

    const block = new FallingBlock(x, fallingBlockSpawnHeight, worldScale)
    this.fallingBlocks.push(block)
  }

  update(dt: number) {
    if (dt > 0.5) return

    this.updateFallingBlocks(dt)
    this.updatePlayer(dt)
    this.updateCamera(dt)

    while (this.blockSpawnTimer.update(dt)) {
      this.spawnFallingBlock()
    }
  }

  updateFallingBlocks(dt: number) {
    this.fallingBlocks.forEach(b => b.update(dt))
    this.fallingBlocks = this.fallingBlocks.filter(block => block.life > -1)

    const activeFallingBlocks = this.fallingBlocks.filter(block => block.active)
    activeFallingBlocks.forEach(activeBlock => {
      this.world.blocks.forEach(worldBlock => {
        activeBlock.resolveCollision(worldBlock)
      })
    })

    const sortedByHeight = activeFallingBlocks.slice().sort((a, b) => a.y - b.y)
    for (let i = 0; i < sortedByHeight.length; i++) {
      for (let j = i; j < sortedByHeight.length; j++) {
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

    this.world.blocks
      .concat(this.fallingBlocks)
      .sort((a, b) => this.player.distanceTo(a) - this.player.distanceTo(b))
      .forEach(collidable => this.player.resolveCollision(collidable))
  }

  updateCamera(dt: number) {
    const x = -this.player.center.x + viewWidth / 2
    const y = -this.player.center.y + viewHeight / 2 + cameraVerticalOffset
    this.camera.panTo(x, y, dt * cameraStiffness)
  }

  keydown(event: KeyboardEvent) {
    this.playerInput.keydown(event)
  }

  keyup(event: KeyboardEvent) {
    this.playerInput.keyup(event)
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.camera.applyTransform(ctx, () => {
      this.player.draw(ctx)
      this.world.draw(ctx)
      this.fallingBlocks.forEach(b => b.draw(ctx))
    })
  }
}
