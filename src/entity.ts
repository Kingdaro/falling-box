import { raise } from "./helpers"
import { Rect } from "./rect"
import { Trait } from "./trait"
import { vec } from "./vector"
import { World } from "./world"

export class Entity {
	rect = new Rect()
	velocity = vec()

	private traits = new Map<Function, Trait>()

	constructor(traits: Trait[] = []) {
		for (const trait of traits) {
			trait.entity = this
			this.traits.set(trait.constructor, trait)
		}
	}

	private _world?: World

	set world(world: World) {
		this._world = world
	}

	get world() {
		return this._world ?? raise("Entity must be added to a world")
	}

	getOptional<T extends Trait>(
		constructor: new (...args: any[]) => T,
	): T | undefined {
		const trait = this.traits.get(constructor)
		if (trait instanceof constructor) return trait
	}

	get<T extends Trait>(constructor: new (...args: any[]) => T): T {
		return (
			this.getOptional(constructor) ??
			raise(`trait "${constructor.name}" not found`)
		)
	}

	has(traitConstructor: Function) {
		return this.traits.has(traitConstructor)
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
}
