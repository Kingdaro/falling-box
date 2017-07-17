import { GameState, viewWidth, viewHeight } from './game'
import { Player, PlayerInput } from './player'
import { FallingBlock, FallingBlockState } from './falling-block'
import { randomRange, roundTo } from '../util/math'
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
    this.world.calculateBounds()
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

    const block = new FallingBlock(x, fallingBlockSpawnHeight)
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

    const frozenBlocks = this.fallingBlocks.filter(block => block.isFrozen)
    const collidables = this.world.blocks.concat(frozenBlocks)

    this.fallingBlocks
      .filter(block => block.state === FallingBlockState.falling)
      .filter(block => block.resolveGroupCollision(collidables))
      .forEach(block => (block.state = FallingBlockState.frozen))
  }

  updatePlayer(dt: number) {
    this.player.update(dt)

    if (this.player.y > worldFalloutDepth) {
      this.respawnPlayer()
    }

    if (this.player.checkSquish(this.fallingBlocks)) {
      this.respawnPlayer()
    } else {
      const collidables = this.world.blocks.concat(
        this.fallingBlocks.filter(block => block.isFrozen),
      )
      this.player.resolveGroupCollision(collidables)
    }
  }

  updateCamera(dt: number) {
    const x = -this.player.center.x + viewWidth / 2
    const y = -this.player.center.y + viewHeight / 2 + cameraVerticalOffset
    this.camera.panTo(x, y, dt * cameraStiffness)
  }

  handleBlockGrab(player: Player) {
    if (!player.holdingBlock) {
      const index = player.findGrabbedBlock(this.fallingBlocks)
      if (index > -1) {
        this.fallingBlocks.splice(index, 1)
        player.holdingBlock = true
      }
    }
  }

  handleBlockRelease(player: Player) {
    if (player.holdingBlock) {
      const x = roundTo(player.grabPosition.x - worldScale / 2, worldScale)
      const y = player.grabPosition.y - worldScale / 2
      this.fallingBlocks.push(new FallingBlock(x, y))
      player.holdingBlock = false
    }
  }

  keydown(event: KeyboardEvent) {
    this.playerInput.keydown(event)

    if (event.key === 'z') {
      this.handleBlockGrab(this.player)
    }
  }

  keyup(event: KeyboardEvent) {
    this.playerInput.keyup(event)

    if (event.key === 'z') {
      this.handleBlockRelease(this.player)
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.camera.applyTransform(ctx, () => {
      this.player.draw(ctx)
      this.world.draw(ctx)
      this.fallingBlocks.forEach(b => b.draw(ctx))
    })
  }
}
