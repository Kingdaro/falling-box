import { checkCollision, Collision } from "./collision"
import { Entity } from "./entity"
import { context } from "./graphics"
import { compare } from "./helpers"
import { vec } from "./vector"

export interface Trait {
	update?(_entity: Entity, _dt: number): void
	draw?(_entity: Entity): void
}

export class DrawRectTrait implements Trait {
	constructor(public color = "white") {}

	draw(ent: Entity) {
		context.fillStyle = this.color
		context.fillRect(...ent.rect.valuesRounded)
	}
}

export class GravityTrait implements Trait {
	constructor(public amount: number, public terminalVelocity = Infinity) {}

	update(ent: Entity, dt: number) {
		ent.velocity = vec(
			ent.velocity.x,
			Math.min(ent.velocity.y + this.amount * dt, this.terminalVelocity),
		)
	}
}

export class CollisionTrait implements Trait {
	// we have this array so that other traits can use the collision info and do stuff with it,
	// e.g. resolve velocity, reset jumps, or something else
	// this _may_ make the traits order-dependent in the entity,
	// which is kind of unwieldy.
	// it might be better to turn this into an event emitter that triggers on collisions,
	// then add lifecycle callbacks to traits so they can listen on init, then clean up the listener
	// maybe maybe
	collisions: Collision[] = []

	constructor(public getTargets: () => readonly Entity[]) {}

	update(ent: Entity) {
		const distanceToSelf = (other: Entity) =>
			ent.rect.center.distanceTo(other.rect.center)

		const sortedByDistance = this.getTargets()
			.slice()
			.sort(compare(distanceToSelf))

		let rect = ent.rect.copy()
		const collisions: Collision[] = []

		for (const other of sortedByDistance) {
			if (other === ent) continue

			const collision = checkCollision(rect, other.rect)
			if (collision) {
				rect = rect.withPosition(rect.position.plus(collision.displacement))
				collisions.push(collision)
			}
		}

		ent.rect = rect
		this.collisions = collisions
	}
}

export class VelocityResolutionTrait implements Trait {
	update(ent: Entity) {
		const { collisions } = ent.get(CollisionTrait)
		let [xvel, yvel] = ent.velocity.components()

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

		ent.velocity = vec(xvel, yvel)
	}
}

export class TimedRemovalTrait implements Trait {
	constructor(private time: number) {}

	update(ent: Entity, dt: number) {
		this.time -= dt
		if (this.time < 0) {
			ent.destroy()
		}
	}
}
