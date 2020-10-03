const keys = new Set<string>()

window.addEventListener("keydown", (event) => {
  keys.add(event.key)
})
window.addEventListener("keyup", (event) => {
  keys.delete(event.key)
})

export function isAnyDown(...args: string[]) {
  return args.some((key) => keys.has(key))
}
