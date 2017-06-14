import { animationFrame } from './util'
import { Player } from './player'

export const canvas = document.createElement('canvas')
export const renderer = canvas.getContext('2d') as CanvasRenderingContext2D

const player = new Player()

function update(dt: number) {
  player.update(dt)
}

function keydown(event: KeyboardEvent) {
  player.keydown(event)
}

function keyup(event: KeyboardEvent) {
  player.keyup(event)
}

function draw() {
  renderer.clearRect(0, 0, canvas.width, canvas.height)
  player.draw()
}

export async function run() {
  canvas.width = 1280
  canvas.height = 720
  canvas.style.backgroundColor = 'black'
  canvas.onkeydown = keydown
  canvas.onkeyup = keyup
  canvas.tabIndex = 0
  document.body.innerHTML = ''
  document.body.appendChild(canvas)
  canvas.focus()

  let time = await animationFrame()

  while (true) {
    const frameTime = await animationFrame()
    const elapsed = (frameTime - time) / 1000
    time = frameTime
    update(elapsed)
    draw()
  }
}
