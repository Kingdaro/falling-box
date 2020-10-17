import { checkCollision, Collision } from "./collision"
import { Entity } from "./entity"
import { context } from "./graphics"
import { compare } from "./helpers"
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

export class CollisionTrait extends Trait {
	collisions: Collision[] = []

	constructor(private readonly shouldCollide: (entity: Entity) => boolean) {
		super()
	}

	update() {
		let rect = this.entity.rect.copy()
		const collisions: Collision[] = []

		const targets = this.world.entities
			.filter(this.shouldCollide)
			.sort(compare(this.distanceToSelf))

		for (const other of targets) {
			if (other === this.entity) continue

			const collision = checkCollision(rect, other.rect)
			if (collision) {
				rect = rect.withPosition(rect.position.plus(collision.displacement))
				collisions.push(collision)
			}
		}

		this.entity.rect = rect
		this.collisions = collisions
	}

	private distanceToSelf = (other: Entity) => {
		return this.entity.rect.center.distanceTo(other.rect.center)
	}
}

export class VelocityResolutionTrait extends Trait {
	update() {
		const { collisions } = this.entity.get(CollisionTrait)
		let [xvel, yvel] = this.entity.velocity.components()

		for (const { displacement } of collisions) {
			if (
				displacement.x !== 0 &&
				Math.sign(displacement.x) !== Math.sign(xvel)
			) {
				xvel = 0
			}

			if (
				displacement.y !== 0 &&
				Math.sign(displacement.y) !== Math.sign(yvel)
			) {
				yvel = 0
			}
		}

		this.entity.velocity = vec(xvel, yvel)
	}
}

export class TimedRemovalTrait extends Trait {
	constructor(private time: number) {
		super()
	}

	update(dt: number) {
		this.time -= dt
		if (this.time < 0) {
			this.entity.destroy()
		}
	}
}
