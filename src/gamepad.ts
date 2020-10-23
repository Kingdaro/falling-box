const buttonNameMap = {
	a: 0,
	b: 1,
	x: 2,
	y: 3,
	leftShoulder: 4,
	rightShoulder: 5,
	leftBumper: 6,
	rightBumper: 7,
	back: 8,
	start: 9,
	leftStick: 10,
	rightStick: 11,
	dpadUp: 12,
	dpadDown: 13,
	dpadLeft: 14,
	dpadRight: 15,
}
export type ButtonName = keyof typeof buttonNameMap

const axisNameMap = {
	leftX: 0,
	leftY: 1,
	rightX: 2,
	rightY: 3,
}
export type AxisName = keyof typeof axisNameMap

type ButtonState = "justPressed" | "pressed" | "justReleased" | "released"
const buttonStates = new Map<number, ButtonState>()
const buttonValues = new Map<number, number>()
const axisValues = new Map<number, number>()

function getGamepad() {
	for (const gamepad of window.navigator.getGamepads()) {
		if (gamepad) return gamepad
	}
}

export function updateGamepad() {
	const gamepad = getGamepad()
	if (!gamepad) return

	for (const [key, state] of buttonStates) {
		if (state === "justPressed") {
			buttonStates.set(key, "pressed")
		}
		if (state === "justReleased") {
			buttonStates.set(key, "released")
		}
	}

	for (const [index, button] of gamepad.buttons.entries()) {
		const state = buttonStates.get(index) || "released"
		if (button.pressed && state === "released") {
			buttonStates.set(index, "justPressed")
		}
		if (!button.pressed && state === "pressed") {
			buttonStates.set(index, "justReleased")
		}

		buttonValues.set(index, button.value)
	}

	for (const [index, value] of gamepad.axes.entries()) {
		axisValues.set(index, value)
	}
}

export function isButtonDown(name: ButtonName) {
	const state = buttonStates.get(buttonNameMap[name])
	return state === "justPressed" || state === "pressed"
}

export function getButtonValue(name: ButtonName) {
	return buttonValues.get(buttonNameMap[name]) ?? 0
}

export function wasButtonPressed(name: ButtonName) {
	return buttonStates.get(buttonNameMap[name]) === "justPressed"
}

export function wasButtonReleased(name: ButtonName) {
	return buttonStates.get(buttonNameMap[name]) === "justReleased"
}

const deadzone = 0.3
export function getAxis(name: AxisName) {
	const value = axisValues.get(axisNameMap[name]) ?? 0
	if (Math.abs(value) < deadzone) return 0
	return value
}
