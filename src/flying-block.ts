import { DrawRectTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { DeathTrait } from "./player/player"
import { Rect } from "./rect"
import { Trait } from "./trait"
import { vec, Vector } from "./vector"

export class FlyingBlock extends Entity {
	constructor(centerPosition: Vector, direction: 1 | -1, owner: Entity) {
		super()

		this.attach(DrawRectTrait, { color: "green" }).attach(DestructionTrait, {
			direction,
			owner,
		})

		this.rect = new Rect(
			vec(worldGridScale),
			centerPosition.minus(worldGridScale / 2),
		)
	}

	onAdded() {
		this.world.scheduler.after(2, () => this.destroy())
	}
}

class DestructionTrait extends Trait<{ direction: number; owner: Entity }> {
	static maxFreezeTime = 0.15
	static speed = 1000

	hits = 3
	freezeTime = 0

	update(dt: number) {
		if (this.freezeTime > 0) {
			this.entity.velocity = vec(0, 0)
			this.freezeTime -= dt
		} else {
			this.entity.velocity = vec(
				DestructionTrait.speed * this.data.direction,
				0,
			)

			let hitBlock = false
			let hitPlayer = false

			for (const ent of this.world.entities) {
				if (
					ent.has(FlyingBlockDestructionTargetTrait) &&
					this.entity.rect.intersects(ent.rect)
				) {
					this.hits -= 1
					this.hits > 0 ? ent.destroy() : this.entity.destroy()
					this.freezeTime = DestructionTrait.maxFreezeTime
					hitBlock = true
				}

				if (
					ent.has(DeathTrait) &&
					this.entity.rect.intersects(ent.rect) &&
					ent !== this.data.owner
				) {
					ent.get(DeathTrait).kill()
					hitPlayer = false
				}

				if (hitBlock && hitPlayer) break
			}
		}
	}
}

export class FlyingBlockDestructionTargetTrait extends Trait {}
