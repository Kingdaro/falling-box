import { context } from "./graphics"
import { Trait } from "./trait"
import { vec } from "./vector"

export class DrawRectTrait extends Trait<{ color?: string }> {
	draw() {
		context.fillStyle = this.data.color ?? "white"
		context.fillRect(...this.entity.rect.valuesRounded)
	}
}

export class GravityTrait extends Trait<{
	amount: number
	terminalVelocity?: number
}> {
	update(dt: number) {
		this.entity.velocity = vec(
			this.entity.velocity.x,
			Math.min(
				this.entity.velocity.y + this.data.amount * dt,
				this.data.terminalVelocity ?? Infinity,
			),
		)
	}
}
