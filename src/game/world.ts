import { GameObject } from './game-object'

export const worldScale = 70

export class WorldBlock extends GameObject {}

export class World {
  blocks = [] as WorldBlock[]

  bounds = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }

  addBlock(wx: number, wy: number, wwidth: number, wheight: number) {
    this.blocks.push(
      new WorldBlock(
        wx * worldScale,
        wy * worldScale,
        wwidth * worldScale,
        wheight * worldScale,
      ),
    )
  }

  calculateBounds() {
    let left = 0
    let right = 0
    let top = 0
    let bottom = 0

    for (const block of this.blocks) {
      left = Math.min(left, block.x)
      right = Math.max(right, block.x + block.width)
      top = Math.min(top, block.y)
      bottom = Math.max(bottom, block.y + block.height)
    }

    this.bounds = { left, right, top, bottom }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.blocks.forEach(b => b.draw(ctx))
  }
}
