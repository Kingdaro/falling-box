import { canvas, renderer } from './game'

export class FallingBlock {
  width = 50
  height = 50

  constructor(public x: number, public y: number) {}

  draw() {
    renderer.fillStyle = 'white'
    renderer.fillRect(this.x, this.y, this.width, this.height)
  }
}
