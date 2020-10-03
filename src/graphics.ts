export const canvas = document.createElement("canvas")
canvas.style.background = "black"
canvas.style.display = "block"

export const context = canvas.getContext("2d")!

function sizeCanvasToWindow() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

export function initGraphics() {
  sizeCanvasToWindow()
  window.addEventListener("resize", sizeCanvasToWindow)
}
