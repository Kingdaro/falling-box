import { Entity } from "./entity"
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

export class TimerTrait extends Trait {
	private completed = false

	constructor(private time: number, private action: (entity: Entity) => void) {
		super()
	}

	update(dt: number) {
		this.time -= dt
		if (this.time < 0 && !this.completed) {
			this.action(this.entity)
			this.completed = true
		}
	}
}
