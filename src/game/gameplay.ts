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
  camera = { x: 0, y: 0 }

  enter() {
    this.respawnPlayer()
    this.createWorld()
  }

  update(dt: number) {
    if (dt > 0.5) return

    this.updateFallingBlocks(dt)
    this.updatePlayer(dt)
    this.updateCamera(dt)

    this.blockSpawnTimer -= dt
    while (this.blockSpawnTimer <= 0) {
      this.blockSpawnTimer += 0.3
      this.spawnFallingBlock()
    }
  }

  keydown(event: KeyboardEvent) {
    this.playerInput.keydown(event)
  }

  keyup(event: KeyboardEvent) {
    this.playerInput.keyup(event)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(Math.round(this.camera.x), Math.round(this.camera.y))
    this.player.draw(ctx)
    this.worldBlocks.forEach(b => b.draw(ctx))
    this.fallingBlocks.forEach(b => b.draw(ctx))
    ctx.restore()
  }

  respawnPlayer() {
    this.player.x = randomRange(0, 29) * worldScale
    this.player.y = playerSpawnHeight
    this.player.xvel = 0
    this.player.yvel = 0
  }

  createWorld() {
    this.addWorldBlock(0, 0, 30, 1)
    this.addWorldBlock(1, 1, 28, 1)
    this.addWorldBlock(2, 2, 26, 1)
  }

  addWorldBlock(wx: number, wy: number, wwidth: number, wheight: number) {
    this.worldBlocks.push(
      new GameObject(
        wx * worldScale,
        wy * worldScale,
        wwidth * worldScale,
        wheight * worldScale,
      ),
    )
  }

  spawnFallingBlock() {
    const x = randomRange(0, 29) * worldScale
    const block = new FallingBlock(x, fallingBlockSpawnHeight, worldScale)
    this.fallingBlocks.push(block)
  }

  updateFallingBlocks(dt: number) {
    this.fallingBlocks.forEach(b => b.update(dt))
    this.fallingBlocks = this.fallingBlocks.filter(block => block.life > -1)

    const activeFallingBlocks = this.fallingBlocks.filter(block => block.active)
    activeFallingBlocks.forEach(activeBlock => {
      this.worldBlocks.forEach(worldBlock => {
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

    this.worldBlocks
      .concat(this.fallingBlocks)
      .sort((a, b) => this.player.distanceTo(a) - this.player.distanceTo(b))
      .forEach(collidable => this.player.resolveCollision(collidable))
  }

  updateCamera(dt: number) {
    const xTarget = -this.player.center.x + viewWidth / 2
    const yTarget =
      -this.player.center.y + viewHeight / 2 + cameraVerticalOffset

    this.camera.x = lerpClamped(this.camera.x, xTarget, dt * cameraStiffness)
    this.camera.y = lerpClamped(this.camera.y, yTarget, dt * cameraStiffness)
  }
}
