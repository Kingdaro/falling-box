import { Rect } from "./rect"
import { vec, Vector } from "./vector"

export type EntityOptions<T> = {
	data: T
	traits: Trait<T>[]
}

export type Entity<T> = EntityOptions<T> & {
	rect: Rect
	velocity: Vector
}

export function createEntity<T>(entity: EntityOptions<T>): Entity<T> {
	return {
		...entity,
		rect: new Rect(),
		velocity: vec(),
	}
}

export type Trait<T> = {
	update: (context: TraitUpdateContext<T>) => void
}

export type TraitUpdateContext<T> = {
	dt: number
	data: T
}

export function createTrait<T>(trait: Trait<T>) {
	return trait
}
