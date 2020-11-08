import { raise } from "./helpers"
import { Rect } from "./rect"
import { Trait } from "./trait"
import { vec } from "./vector"
import { World } from "./world"

type TraitClass<T> = new (entity: Entity, data: T) => Trait<T>

export class Entity {
	rect = new Rect()
	velocity = vec()

	private traits = new Map<Function, Trait<unknown>>()

	private _world?: World

	set world(world: World) {
		this._world = world
	}

	get world() {
		return this._world ?? raise("Entity must be added to a world")
	}

	// I would love to compress these overloads into one,
	// but generic void arguments still don't work :(
	attach(TraitClass: TraitClass<void>): this
	attach<D>(TraitClass: TraitClass<D>, data: D): this
	attach(TraitClass: TraitClass<any>, data?: any) {
		this.traits.set(TraitClass, new TraitClass(this, data))
		return this
	}

	getOptional<T extends Trait<unknown>>(
		constructor: new (...args: any[]) => T,
	): T | undefined {
		const trait = this.traits.get(constructor)
		if (trait instanceof constructor) return trait
	}

	get<T extends Trait<unknown>>(constructor: new (...args: any[]) => T): T {
		return (
			this.getOptional(constructor) ??
			raise(`trait "${constructor.name}" not found`)
		)
	}

	has(constructor: new (...args: any[]) => Trait<unknown>) {
		return this.traits.has(constructor)
	}

	update(dt: number) {
		this.rect.position = this.rect.position.plus(this.velocity.times(dt))
		this.traits.forEach((t) => t.update?.(dt))
	}

	draw() {
		this.traits.forEach((t) => t.draw?.())
	}

	onMessage(message: unknown) {
		this.traits.forEach((t) => t.onMessage?.(message))
	}

	destroy() {
		this.world.remove(this)
	}

	/**
	 * Called when added to the world
	 */
	onAdded?(): void
}
