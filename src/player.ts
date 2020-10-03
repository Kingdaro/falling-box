import { context } from "./graphics"
import { isAnyDown } from "./keyboard"
import { Rect } from "./rect"

const playerSpeed = 500

export class Player {
  rect = new Rect(100, 100, 40)

  update(dt: number) {
    if (isAnyDown("ArrowLeft", "KeyA")) {
      this.rect.left -= playerSpeed * dt
    }
    if (isAnyDown("ArrowRight", "KeyR")) {
      this.rect.left += playerSpeed * dt
    }
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.components)
  }
}
