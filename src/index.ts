import { canvas, initGraphics } from "./graphics"
import "./styles.css"

function main() {
  initGraphics()

  const app = document.getElementById("app")
  app?.append(canvas)
}

main()
