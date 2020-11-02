import { raise } from "./helpers"

export class StateMachine {
	private state?: StateMachineState
	private states = new Map<Function, StateMachineState>()

	constructor(states: StateMachineState[]) {
		states.forEach((state) => {
			this.states.set(state.constructor, state)
		})
	}

	setState(constructor: new (...args: any[]) => StateMachineState) {
		this.state?.onExit?.()

		this.state =
			this.states.get(constructor) ??
			raise(`Undefined state: "${constructor.name}"`)

		this.state.machine = this
		this.state.onEnter?.()
	}

	update(dt: number) {
		this.state?.update?.(dt)
	}
}

export abstract class StateMachineState {
	private _machine?: StateMachine
	get machine(): StateMachine {
		return this._machine ?? raise("machine not set")
	}
	set machine(value: StateMachine) {
		this._machine = value
	}

	onEnter?(): void
	onExit?(): void
	update?(dt: number): void
}
