import { GamepadAxisInput, GamepadButtonInput } from "../input/gamepad"
import { Controller, Input } from "../input/input"
import { KeyboardInput } from "../input/keyboard"
import { Trait, TraitUpdateArgs } from "../trait"
import { GrabTrait, MovementTrait } from "./player"

export class HumanControllerTrait extends Trait {
	private readonly controller = new Controller({
		left: Input.combined(
			GamepadAxisInput.negative("leftX"),
			new GamepadButtonInput("dpadLeft"),
			new KeyboardInput("ArrowLeft"),
		),

		right: Input.combined(
			GamepadAxisInput.positive("leftX"),
			new GamepadButtonInput("dpadRight"),
			new KeyboardInput("ArrowRight"),
		),

		jump: Input.combined(
			new GamepadButtonInput("a"),
			new KeyboardInput("ArrowUp"),
		),

		grab: Input.combined(
			new GamepadButtonInput("x"),
			new KeyboardInput("KeyZ"),
		),
	})

	update({ entity }: TraitUpdateArgs) {
		const { left, right, jump, grab } = this.controller.update()

		const movement = entity.get(MovementTrait)
		movement.movement = right.value - left.value

		if (jump.wasPressed) {
			movement.jump()
		}

		const grabbing = entity.get(GrabTrait)
		if (grab.wasPressed) grabbing.grab()
		if (grab.wasReleased) grabbing.release()
	}
}
