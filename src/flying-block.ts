import { worldGridScale } from "./constants"
import { Entity, EntityGroup } from "./entity"
import { Rect } from "./rect"
import { DrawRectTrait, TimedRemovalTrait, Trait } from "./traits"
import { vec, Vector } from "./vector"

export function createFlyingBlock(
	centerPosition: Vector,
	direction: 1 | -1,
	staticBlockGroup: EntityGroup,
) {
	const ent = new Entity([
		new DrawRectTrait("green"),
		new TimedRemovalTrait(2),
		new DestructionTrait(direction, staticBlockGroup),
	])

	ent.rect = new Rect(
		vec(worldGridScale),
		centerPosition.minus(worldGridScale / 2),
	)

	return ent
}

class DestructionTrait implements Trait {
	static maxFreezeTime = 0.15
	static speed = 1000

	hits = 3
	freezeTime = 0

	constructor(
		private readonly direction: number,
		private readonly staticBlockGroup: EntityGroup,
	) {}

	update(entity: Entity, dt: number) {
		if (this.freezeTime > 0) {
			entity.velocity = vec(0, 0)
			this.freezeTime -= dt
		} else {
			entity.velocity = vec(DestructionTrait.speed * this.direction, 0)

			const hitBlock = this.staticBlockGroup.entities.find((other) =>
				entity.rect.intersects(other.rect),
			)

			if (hitBlock) {
				this.hits -= 1
				this.hits > 0 ? hitBlock.destroy() : entity.destroy()
				this.freezeTime = DestructionTrait.maxFreezeTime
			}
		}
	}
}
