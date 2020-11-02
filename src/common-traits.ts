import { context } from "./graphics"
import { Trait } from "./trait"
import { vec } from "./vector"

export class DrawRectTrait extends Trait {
	constructor(public color = "white") {
		super()
	}

	draw() {
		context.fillStyle = this.color
		context.fillRect(...this.entity.rect.valuesRounded)
	}
}

export class GravityTrait extends Trait {
	constructor(public amount: number, public terminalVelocity = Infinity) {
		super()
	}

	update(dt: number) {
		this.entity.velocity = vec(
			this.entity.velocity.x,
			Math.min(
				this.entity.velocity.y + this.amount * dt,
				this.terminalVelocity,
			),
		)
	}
}
