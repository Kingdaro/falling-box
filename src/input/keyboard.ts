import { Input } from "./input"

const pressedKeys = new Set<string>()

window.addEventListener("keydown", (event) => {
	if (!event.repeat) pressedKeys.add(event.code)
})

window.addEventListener("keyup", (event) => {
	if (!event.repeat) pressedKeys.delete(event.code)
})

// release all keys when unfocused to avoid bad/inconsistent key states
window.addEventListener("blur", () => pressedKeys.clear())

export class KeyboardInput extends Input {
	constructor(private readonly key: string) {
		super()
	}

	getCurrentValue() {
		return pressedKeys.has(this.key) ? 1 : 0
	}
}
