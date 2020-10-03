import { Game } from "./game"
import { updateGamepad } from "./gamepad"
import { canvas, initGraphics } from "./graphics"
import { updateKeyboard } from "./keyboard"
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
    const elapsed = Math.min(frameTime - currentTime, 100)
    currentTime = frameTime

    updateKeyboard()
    updateGamepad()

    game.update(elapsed / 1000)
    game.draw()
  }
}

main().catch(console.error)
