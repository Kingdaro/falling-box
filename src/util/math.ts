export function lerp(value: number, target: number, delta: number) {
  return value + (target - value) * delta
}

export function clamp(value: number, min: number, max: number) {
  if (value > max) return max
  if (value < min) return min
  return value
}

export function lerpClamped(value: number, target: number, delta: number) {
  return lerp(value, target, clamp(delta, 0, 1))
}

export function randomRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}
