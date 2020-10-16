import { DrawRectTrait, TimedRemovalTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { Rect } from "./rect"
import { Trait } from "./trait"
import { vec, Vector } from "./vector"

export function createFlyingBlock(centerPosition: Vector, direction: 1 | -1) {
	const ent = new Entity([
		new DrawRectTrait("green"),
		new TimedRemovalTrait(2),
		new DestructionTrait(direction),
	])

	ent.rect = new Rect(
		vec(worldGridScale),
		centerPosition.minus(worldGridScale / 2),
	)

	return ent
}

class DestructionTrait extends Trait {
	static maxFreezeTime = 0.15
	static speed = 1000

	hits = 3
	freezeTime = 0

	constructor(private readonly direction: number) {
		super()
	}

	update(dt: number) {
		if (this.freezeTime > 0) {
			this.entity.velocity = vec(0, 0)
			this.freezeTime -= dt
		} else {
			this.entity.velocity = vec(DestructionTrait.speed * this.direction, 0)

			const hitBlock = this.world.entities.find(
				(other) =>
					other.has(FlyingBlockDestructionTargetTrait) &&
					this.entity.rect.intersects(other.rect),
			)

			if (hitBlock) {
				this.hits -= 1
				this.hits > 0 ? hitBlock.destroy() : this.entity.destroy()
				this.freezeTime = DestructionTrait.maxFreezeTime
			}
		}
	}
}

export class FlyingBlockDestructionTargetTrait extends Trait {}
