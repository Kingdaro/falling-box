type KeyState = "justPressed" | "pressed" | "justReleased" | "released"
const keyStates = new Map<string, KeyState>()
const eventQueue: KeyboardEvent[] = []

window.addEventListener("keydown", (event) => {
	if (!event.repeat) eventQueue.push(event)
})

window.addEventListener("keyup", (event) => {
	if (!event.repeat) eventQueue.push(event)
})

// release all keys when unfocused to avoid bad/inconsistent key states
window.addEventListener("blur", () => keyStates.clear())

export function updateKeyboard() {
	for (const [key, state] of keyStates) {
		if (state === "justPressed") {
			keyStates.set(key, "pressed")
		}
		if (state === "justReleased") {
			keyStates.set(key, "released")
		}
	}

	let event
	while ((event = eventQueue.pop())) {
		if (event.type === "keydown") {
			keyStates.set(event.code, "justPressed")
		}
		if (event.type === "keyup") {
			keyStates.set(event.code, "justReleased")
		}
	}
}

export function isDown(key: string) {
	const state = keyStates.get(key)
	return state === "pressed" || state === "justPressed"
}

export function wasPressed(key: string) {
	return keyStates.get(key) === "justPressed"
}

export function wasReleased(key: string) {
	return keyStates.get(key) === "justReleased"
}
