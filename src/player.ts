import { context } from "./graphics"
import { isAnyDown } from "./keyboard"
import { Rect } from "./rect"

const playerSpeed = 500
const playerGravity = 2500

export class Player {
  rect = new Rect(0, -300, 40)
  xvel = 0
  yvel = 0

  update(dt: number) {
    let xvel = 0
    if (isAnyDown("ArrowLeft", "KeyA")) xvel -= playerSpeed
    if (isAnyDown("ArrowRight", "KeyR")) xvel += playerSpeed
    this.xvel = xvel

    this.yvel += playerGravity * dt

    this.rect.move(this.xvel * dt, this.yvel * dt)
  }

  draw() {
    context.fillStyle = "white"
    context.fillRect(...this.rect.values)
  }
}
