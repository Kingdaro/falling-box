import { Entity } from "./entity"

export abstract class Trait<T = void> {
	constructor(protected readonly entity: Entity, protected readonly data: T) {}

	protected get world() {
		return this.entity.world
	}

	update?(dt: number): void
	draw?(): void
	onMessage?(message: unknown): void
}

export class EmptyTrait extends Trait {}
