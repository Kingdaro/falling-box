import { raise } from "./helpers"
import { Rect } from "./rect"
import { Trait } from "./traits"
import { vec } from "./vector"

export class Entity {
	rect = new Rect()
	velocity = vec()
	isMarkedForRemoval = false

	private traits = new Map<Function, Trait>()

	constructor(traits: object[] = []) {
		for (const trait of traits) {
			this.traits.set(trait.constructor, trait)
		}
	}

	getOptional<T extends object>(
		constructor: new (...args: any[]) => T,
	): T | undefined {
		const trait = this.traits.get(constructor)
		if (trait instanceof constructor) return trait
	}

	get<T extends object>(constructor: new (...args: any[]) => T): T {
		return (
			this.getOptional(constructor) ??
			raise(`trait "${constructor.name}" not found`)
		)
	}

	destroy() {
		this.isMarkedForRemoval = true
	}

	update(dt: number) {
		this.rect.position = this.rect.position.plus(this.velocity.times(dt))
		this.traits.forEach((t) => t.update?.(this, dt))
	}

	draw() {
		this.traits.forEach((t) => t.draw?.(this))
	}

	onAdded?(): void
	onRemoved?(): void
}

export class EntityGroup<E extends Entity = Entity> extends Entity {
	private entitySet = new Set<E>()

	get entities() {
		return [...this.entitySet]
	}

	add<TAdded extends E>(ent: TAdded): TAdded {
		this.entitySet.add(ent)
		ent.onAdded?.()
		return ent
	}

	remove(ent: E) {
		this.entitySet.delete(ent)
		ent.onRemoved?.()
	}

	update(dt: number) {
		this.entitySet.forEach((e) => e.update(dt))

		const removedEntities = [...this.entitySet].filter(
			(e) => e.isMarkedForRemoval,
		)

		removedEntities.forEach((e) => this.entitySet.delete(e))
	}

	draw() {
		this.entitySet.forEach((ent) => ent.draw())
	}
}
