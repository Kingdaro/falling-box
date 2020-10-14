import { raise } from "./helpers"
import { Trait } from "./traits"

export class Entity {
	private traits = new Map<Function, Trait>()
	shouldDestroy = false

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
		this.shouldDestroy = true
	}

	update(dt: number) {
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
		for (const ent of this.entitySet) {
			ent.update(dt)
		}

		for (const ent of this.entitySet) {
			if (ent.shouldDestroy) {
				this.remove(ent)
			}
		}
	}

	draw() {
		for (const ent of this.entitySet) {
			ent.draw()
		}
	}
}
