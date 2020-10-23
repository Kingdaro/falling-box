import * as gamepad from "./gamepad"
import * as keyboard from "./keyboard"
import { clamp } from "./math"

export type InputState = {
	readonly value: number
	readonly isDown: boolean
	readonly wasPressed: boolean
	readonly wasReleased: boolean
}

export abstract class Input {
	private state?: InputState

	protected abstract getCurrentValue(): number

	nextState(): InputState {
		const value = this.getCurrentValue()
		const isDown = value > 0.5

		const prev = this.state ?? {
			value,
			isDown: value > 0.5,
			wasPressed: false,
			wasReleased: false,
		}

		const newState = {
			value,
			isDown,
			wasPressed: isDown && !prev.isDown,
			wasReleased: !isDown && prev.isDown,
		}

		return (this.state = newState)
	}
}

export class KeyboardInput extends Input {
	constructor(private readonly key: string) {
		super()
	}

	protected getCurrentValue() {
		return keyboard.isDown(this.key) ? 1 : 0
	}
}

export class GamepadButtonInput extends Input {
	constructor(private readonly button: gamepad.ButtonName) {
		super()
	}

	protected getCurrentValue() {
		return gamepad.getButtonValue(this.button)
	}
}

export class GamepadAxisInput extends Input {
	private constructor(
		private readonly axis: gamepad.AxisName,
		private readonly filter: (value: number) => number,
	) {
		super()
	}

	static positive(axis: gamepad.AxisName) {
		return new GamepadAxisInput(axis, (value) => clamp(value, 0, 1))
	}

	static negative(axis: gamepad.AxisName) {
		return new GamepadAxisInput(axis, (value) => Math.abs(clamp(value, -1, 0)))
	}

	protected getCurrentValue() {
		return this.filter(gamepad.getAxis(this.axis))
	}
}
