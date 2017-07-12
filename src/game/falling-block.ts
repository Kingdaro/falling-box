// import * as pixi from 'pixi.js'
import { GameObject } from './game-object'

export const blockSize = 70
export const gravity = 1200

export class FallingBlock extends GameObject {
  gravity = gravity

  constructor(x: number, y: number) {
    super(x, y, blockSize)
  }
}
