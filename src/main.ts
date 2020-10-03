import { Game } from "./game"
import { canvas, initGraphics } from "./graphics"
import "./styles.css"

function animationFrame() {
  return new Promise(requestAnimationFrame)
}

async function main() {
  initGraphics()

  const app = document.getElementById("app")!
  app.append(canvas)

  const game = new Game()

  let currentTime = await animationFrame()
  while (true) {
    const frameTime = await animationFrame()
    const elapsed = frameTime - currentTime
    currentTime = frameTime

    game.update(elapsed / 1000)
    game.draw()
  }
}

main().catch(console.error)
