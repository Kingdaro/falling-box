import { raise } from "./helpers"
import { Rect } from "./rect"
import { Trait } from "./trait"
import { vec } from "./vector"
import { World } from "./world"

type TraitClass<T extends Trait> = new (entity: Entity) => T

export class Entity {
	rect = new Rect()
	velocity = vec()

	private traits = new Map<Function, Trait>()

	private _world?: World

	set world(world: World) {
		this._world = world
	}

	get world() {
		return this._world ?? raise("Entity must be added to a world")
	}

	add(trait: Trait) {
		this.traits.set(trait.constructor, trait)
	}

	getOptional<T extends Trait>(constructor: TraitClass<T>): T | undefined {
		const trait = this.traits.get(constructor)
		if (trait instanceof constructor) return trait
	}

	get<T extends Trait>(constructor: TraitClass<T>): T {
		return (
			this.getOptional(constructor) ??
			raise(`trait "${constructor.name}" not found`)
		)
	}

	has(constructor: TraitClass<Trait>) {
		return this.traits.has(constructor)
	}

	update(dt: number) {
		this.rect.position = this.rect.position.plus(this.velocity.times(dt))

		this.traits.forEach((t) => {
			return t.update?.({ entity: this, world: this.world, dt })
		})
	}

	draw() {
		this.traits.forEach((t) => t.draw?.({ entity: this, world: this.world }))
	}

	destroy() {
		this.world.remove(this)
	}

	/**
	 * Called when added to the world
	 */
	onAdded?(): void
}
