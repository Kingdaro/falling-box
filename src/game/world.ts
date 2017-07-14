import { GameObject } from './game-object'

export const worldScale = 70

export class World {
  blocks = [] as GameObject[]

  addBlock(wx: number, wy: number, wwidth: number, wheight: number) {
    this.blocks.push(
      new GameObject(
        wx * worldScale,
        wy * worldScale,
        wwidth * worldScale,
        wheight * worldScale,
      ),
    )
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.blocks.forEach(b => b.draw(ctx))
  }
}
