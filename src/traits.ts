import { checkCollision, Collision } from "./collision"
import { Entity } from "./entity"
import { context } from "./graphics"
import { compare } from "./helpers"
import { Rect } from "./rect"
import { Ref } from "./ref"
import { vec, Vector } from "./vector"

export interface Trait {
	update?(_entity: Entity, _dt: number): void
	draw?(_entity: Entity): void
}

export class DrawRectTrait implements Trait {
	constructor(public color = "white", private readonly rect: Ref<Rect>) {}

	draw() {
		context.fillStyle = this.color
		context.fillRect(...this.rect.value.valuesRounded)
	}
}

export class VelocityTrait implements Trait {
	constructor(
		private readonly rect: Ref<Rect>,
		private readonly velocity: Ref<Vector>,
	) {}

	update(ent: Entity, dt: number) {
		this.rect.value.position = this.rect.value.position.plus(
			this.velocity.value.times(dt),
		)
	}
}

export class GravityTrait implements Trait {
	constructor(
		private readonly amount: number,
		private readonly terminalVelocity = Infinity,
		private readonly velocity: Ref<Vector>,
	) {}

	update(ent: Entity, dt: number) {
		const velocity = this.velocity.value
		this.velocity.value = vec(
			velocity.x,
			Math.min(velocity.y + this.amount * dt, this.terminalVelocity),
		)
	}
}

export class CollisionTrait implements Trait {
	constructor(
		private readonly getTargets: () => readonly Rect[],
		private readonly rect: Ref<Rect>,
		private readonly collisions: Ref<Collision[]>,
	) {}

	update(self: Entity) {
		let rect = this.rect.value

		const distanceToSelf = (otherRect: Rect) =>
			rect.center.distanceTo(otherRect.center)

		const sortedByDistance = this.getTargets()
			.slice()
			.sort(compare(distanceToSelf))

		const collisions: Collision[] = []

		for (const otherRect of sortedByDistance) {
			if (otherRect === rect) continue

			const collision = checkCollision(rect, otherRect)
			if (collision) {
				rect = rect.withPosition(rect.position.plus(collision.displacement))
				collisions.push(collision)
			}
		}

		this.rect.value = rect
		this.collisions.value = collisions
	}
}

export class VelocityResolutionTrait implements Trait {
	constructor(
		private readonly velocity: Ref<Vector>,
		private readonly collisions: Ref<Collision[]>,
	) {}

	update(entity: Entity) {
		let [xvel, yvel] = this.velocity.value.components()

		for (const { displacement } of this.collisions.value) {
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

		this.velocity.value = vec(xvel, yvel)
	}
}

export class TimedRemovalTrait implements Trait {
	constructor(private time: number) {}

	update(entity: Entity, dt: number) {
		this.time -= dt
		if (this.time < 0) {
			entity.destroy()
		}
	}
}
