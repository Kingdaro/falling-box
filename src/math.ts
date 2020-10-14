export function clamp(value: number, min: number, max: number) {
	if (value > max) return max
	if (value < min) return min
	return value
}

export function lerp(a: number, b: number, delta: number) {
	return a + (b - a) * delta
}

export function lerpClamped(a: number, b: number, delta: number) {
	return lerp(a, b, clamp(delta, 0, 1))
}

export function randomRange(min: number, max: number) {
	return lerp(min, max, Math.random())
}

export function roundToNearest(num: number, multiple: number) {
	return Math.round(num / multiple) * multiple
}

export function floorToNearest(num: number, multiple: number) {
	return Math.floor(num / multiple) * multiple
}
