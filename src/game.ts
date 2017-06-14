import { animationFrame } from './util'

const canvas = document.createElement('canvas')
const renderer = canvas.getContext('2d') as CanvasRenderingContext2D

const player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  xvel: 0,
  yvel: 0,
  movingLeft: false,
  movingRight: false,
  speed: 500,
}

function update(dt: number) {
  if (player.movingLeft) player.x -= player.speed * dt
  if (player.movingRight) player.x += player.speed * dt

  player.yvel += dt * 2500
  player.y += player.yvel * dt

  if (player.y + player.height >= canvas.height) {
    player.y = canvas.height - player.height
  }
}

function draw() {
  renderer.clearRect(0, 0, canvas.width, canvas.height)
  renderer.fillStyle = 'white'
  renderer.fillRect(player.x, player.y, 50, 50)
}

function keydown(event: KeyboardEvent) {
  if (event.key === 'ArrowUp') {
    player.yvel = -800
  }

  if (event.key === 'ArrowLeft') {
    player.movingLeft = true
    player.movingRight = false
  }
  if (event.key === 'ArrowRight') {
    player.movingRight = true
    player.movingLeft = false
  }
}

function keyup(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') player.movingLeft = false
  if (event.key === 'ArrowRight') player.movingRight = false
}

export async function run() {
  canvas.width = 1280
  canvas.height = 720
  canvas.style.backgroundColor = 'black'
  canvas.onkeydown = keydown
  canvas.onkeyup = keyup
  canvas.tabIndex = 0
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
