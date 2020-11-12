import { context } from "./graphics"
import { Trait, TraitArgs, TraitUpdateArgs } from "./trait"
import { vec } from "./vector"

export class DrawRectTrait extends Trait {
	constructor(private readonly color?: string) {
		super()
	}

	draw({ entity }: TraitArgs) {
		context.fillStyle = this.color ?? "white"
		context.fillRect(...entity.rect.valuesRounded)
	}
}

export class GravityTrait extends Trait {
	constructor(
		private readonly amount: number,
		private readonly terminalVelocity?: number,
	) {
		super()
	}

	update({ entity, dt }: TraitUpdateArgs) {
		entity.velocity = vec(
			entity.velocity.x,
			Math.min(
				entity.velocity.y + this.amount * dt,
				this.terminalVelocity ?? Infinity,
			),
		)
	}
}
