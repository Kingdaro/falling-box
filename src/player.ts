import { canvas, renderer } from './game'

export class Player {
  x = 100
  y = 100
  width = 50
  height = 50
  xvel = 0
  yvel = 0
  movingLeft = false
  movingRight = false
  speed = 500

  update(dt: number) {
    if (this.movingLeft) this.x -= this.speed * dt
    if (this.movingRight) this.x += this.speed * dt

    this.yvel += dt * 2500
    this.y += this.yvel * dt

    if (this.y + this.height >= canvas.height) {
      this.y = canvas.height - this.height
    }
  }

  keydown(event: KeyboardEvent) {
    if (event.key === 'ArrowUp') {
      this.yvel = -800
    }

    if (event.key === 'ArrowLeft') {
      this.movingLeft = true
      this.movingRight = false
    }
    if (event.key === 'ArrowRight') {
      this.movingRight = true
      this.movingLeft = false
    }
  }

  keyup(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') this.movingLeft = false
    if (event.key === 'ArrowRight') this.movingRight = false
  }

  draw() {
    renderer.clearRect(0, 0, canvas.width, canvas.height)
    renderer.fillStyle = 'white'
    renderer.fillRect(this.x, this.y, 50, 50)
  }
}
