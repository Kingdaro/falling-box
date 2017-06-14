export function animationFrame() {
  return new Promise<number>((resolve, reject) => {
    requestAnimationFrame(resolve)
  })
}
