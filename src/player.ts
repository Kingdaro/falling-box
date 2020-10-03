import { context } from "./graphics"
import { isAnyDown } from "./keyboard"

const playerSpeed = 500

export class Player {
  x = 100
  y = 100
  size = 40

  update(dt: number) {
    if (isAnyDown("ArrowLeft", "KeyA")) {
      this.x -= playerSpeed * dt
    }
    if (isAnyDown("ArrowRight", "KeyR")) {
      this.x += playerSpeed * dt
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(this.x, this.y, this.size, this.size)
  }
}
