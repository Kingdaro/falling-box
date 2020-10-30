import { clamp } from "../math"
import { Input } from "./input"

export type ButtonName = keyof typeof buttonNameMap
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

export type AxisName = keyof typeof axisNameMap
const axisNameMap = {
	leftX: 0,
	leftY: 1,
	rightX: 2,
	rightY: 3,
}

const axisDeadzone = 0.3

function getGamepad() {
	for (const gamepad of window.navigator.getGamepads()) {
		if (gamepad) return gamepad
	}
}

export class GamepadButtonInput extends Input {
	constructor(private readonly buttonName: ButtonName) {
		super()
	}

	getCurrentValue() {
		const gamepad = getGamepad()
		const buttonIndex = buttonNameMap[this.buttonName]
		return gamepad?.buttons[buttonIndex]?.value ?? 0
	}
}

export class GamepadAxisInput extends Input {
	private constructor(
		private readonly axisName: AxisName,
		private readonly filter: (value: number) => number,
	) {
		super()
	}

	static positive(axis: AxisName) {
		return new GamepadAxisInput(axis, (value) => clamp(value, 0, 1))
	}

	static negative(axis: AxisName) {
		return new GamepadAxisInput(axis, (value) => Math.abs(clamp(value, -1, 0)))
	}

	getCurrentValue() {
		const gamepad = getGamepad()

		let value = gamepad?.axes[axisNameMap[this.axisName]] ?? 0
		if (Math.abs(value) < axisDeadzone) {
			value = 0
		}

		return this.filter(value)
	}
}
