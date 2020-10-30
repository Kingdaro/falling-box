export type InputState = {
	readonly value: number
	readonly isDown: boolean
	readonly wasPressed: boolean
	readonly wasReleased: boolean
}

export abstract class Input {
	private state?: InputState

	abstract getCurrentValue(): number

	getNextState(): InputState {
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

	static combined(...inputs: Input[]): CombinedInput {
		return new CombinedInput(inputs)
	}
}

export class CombinedInput extends Input {
	constructor(private readonly inputs: Input[]) {
		super()
	}

	getCurrentValue() {
		for (const input of this.inputs) {
			const value = input.getCurrentValue()
			if (value !== 0) return value
		}
		return 0
	}
}

export class Controller<InputMap extends { [inputName: string]: Input }> {
	constructor(readonly inputs: InputMap) {}

	update() {
		const states = {} as { [K in keyof InputMap]: InputState }
		for (const name in this.inputs) {
			const input = this.inputs[name]
			if (input) states[name] = input.getNextState()
		}
		return states
	}
}
