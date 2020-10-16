import { Entity } from "./entity"
import { raise } from "./helpers"

export abstract class Trait {
	private _entity?: Entity

	set entity(ent: Entity) {
		this._entity = ent
	}

	get entity() {
		return this._entity ?? raise("Trait must be added to an entity")
	}

	get world() {
		return this.entity.world
	}

	update?(dt: number): void
	draw?(): void
	onMessage?(message: unknown): void
}
