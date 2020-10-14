import { worldGridScale } from "./constants"
import { Entity, EntityGroup } from "./entity"
import { Rect } from "./rect"
import {
	DrawRectTrait,
	RectTrait,
	TimedRemovalTrait,
	Trait,
	VelocityTrait,
} from "./traits"
import { vec, Vector } from "./vector"

export function createFlyingBlock(
	centerPosition: Vector,
	direction: 1 | -1,
	staticBlockGroup: EntityGroup,
) {
	return new Entity([
		new RectTrait(
			new Rect(vec(worldGridScale), centerPosition.minus(worldGridScale / 2)),
		),
		new DrawRectTrait("green"),
		new VelocityTrait(),
		new TimedRemovalTrait(2),
		new DestructionTrait(direction, staticBlockGroup),
	])
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
		const { rect } = entity.get(RectTrait)
		const velocityTrait = entity.get(VelocityTrait)

		if (this.freezeTime > 0) {
			velocityTrait.velocity = vec(0, 0)
			this.freezeTime -= dt
		} else {
			velocityTrait.velocity = vec(DestructionTrait.speed * this.direction, 0)
			const hitBlock = this.staticBlockGroup.entities.find((ent) =>
				ent.get(RectTrait).rect.intersects(rect),
			)

			if (hitBlock) {
				this.hits -= 1
				this.hits > 0 ? hitBlock.destroy() : entity.destroy()
				this.freezeTime = DestructionTrait.maxFreezeTime
			}
		}
	}
}
