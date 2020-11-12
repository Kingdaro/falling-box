import { Entity } from "./entity"
import { World } from "./world"

export type TraitArgs = { entity: Entity; world: World }
export type TraitUpdateArgs = TraitArgs & { dt: number }

export abstract class Trait {
	update?(context: TraitUpdateArgs): void
	draw?(context: TraitArgs): void
}

export class EmptyTrait extends Trait {}
