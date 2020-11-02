import { Entity } from "./entity"
import { compare } from "./helpers"
import { Rect } from "./rect"
import { Scheduler } from "./scheduler"
import { vec, Vector } from "./vector"

export type Collision = {
	entity: Entity
	displacement: Vector
}

export class World {
	private entitySet = new Set<Entity>()
	private removedEntities = new Set<Entity>()
	scheduler = new Scheduler()

	get entities() {
		return [...this.entitySet] as const
	}

	add<T extends Entity>(ent: T): T {
		ent.world = this
		this.entitySet.add(ent)
		ent.onAdded?.()
		return ent
	}

	remove(ent: Entity) {
		this.removedEntities.add(ent)
	}

	update(dt: number) {
		this.scheduler.update(dt)
		this.entitySet.forEach((e) => e.update(dt))
		this.removedEntities.forEach((e) => this.entitySet.delete(e))
		this.removedEntities.clear()
	}

	draw() {
		this.entitySet.forEach((ent) => ent.draw())
	}

	send(message: unknown) {
		this.entitySet.forEach((e) => e.onMessage(message))
	}

	findCollisions(entity: Entity, shouldCollide: (entity: Entity) => boolean) {
		const rect = entity.rect.copy()
		const collisions: Collision[] = []

		const distanceToSelf = (other: Entity) => {
			return entity.rect.center.distanceTo(other.rect.center)
		}

		const targets = this.entities
			.filter((other) => other !== entity && shouldCollide(other))
			.sort(compare(distanceToSelf))

		for (const other of targets) {
			const displacement = getCollisionDisplacement(rect, other.rect)
			if (displacement) {
				rect.position = rect.position.plus(displacement)
				collisions.push({ entity: other, displacement })
			}
		}

		return { collisions, finalRect: rect }
	}
}

/**
 * If the two rects are intersecting,
 * return a vector by which to move the first rect to resolve a collision.
 * Returns undefined if there is no intersection
 */
export function getCollisionDisplacement(
	first: Rect,
	second: Rect,
): Vector | undefined {
	if (!first.intersects(second)) return

	const displacementX =
		first.center.x < second.center.x
			? second.left - first.right
			: second.right - first.left

	const displacementY =
		first.center.y < second.center.y
			? second.top - first.bottom
			: second.bottom - first.top

	// displace by the lesser value
	const displacement =
		Math.abs(displacementX) < Math.abs(displacementY)
			? vec(displacementX, 0)
			: vec(0, displacementY)

	return displacement
}
