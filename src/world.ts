import { Entity } from "./entity"

export class World {
	private entitySet = new Set<Entity>()
	private removedEntities = new Set<Entity>()

	get entities() {
		return [...this.entitySet] as const
	}

	add<T extends Entity>(ent: T): T {
		ent.world = this
		this.entitySet.add(ent)
		return ent
	}

	remove(ent: Entity) {
		this.removedEntities.add(ent)
	}

	update(dt: number) {
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
}
