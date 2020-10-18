import { DrawRectTrait, GravityTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FlyingBlockDestructionTargetTrait } from "./flying-block"
import { createPlayerSpawner, GrabTargetTrait, PlayerTrait } from "./player"
import { Rect } from "./rect"
import { createStaticBlock } from "./static-block"
import { Trait } from "./trait"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const verticalSpawnPosition = -1500
const gravity = 800
const terminalVelocity = 800

export function createFallingBlock(map: WorldMap) {
	const ent = new Entity([
		new DrawRectTrait(),
		new GravityTrait(gravity, terminalVelocity),
		new BecomeStaticTrait(),
		new GrabTargetTrait(),
		new FlyingBlockDestructionTargetTrait(),
		new SquishTrait(map),
	])

	ent.rect = new Rect(
		vec(worldGridScale),
		vec(map.getRespawnPosition(), verticalSpawnPosition),
	)

	return ent
}

export class FallingBlockFloorTrait extends Trait {}

class BecomeStaticTrait extends Trait {
	update() {
		const { rect, collisions } = this.world.findCollisions(this.entity, (ent) =>
			ent.has(FallingBlockFloorTrait),
		)

		if (collisions.some((col) => col.displacement.y < 0)) {
			this.entity.destroy()
			this.world.add(createStaticBlock(rect.position))
		}
	}
}

class SquishTrait extends Trait {
	constructor(private readonly map: WorldMap) {
		super()
	}

	update() {
		const targets = this.world.entities.filter((ent) => ent.has(PlayerTrait))
		const { rect } = this.entity
		for (const target of targets) {
			const isIntersecting = rect.intersects(target.rect)

			const isInside =
				Math.abs(target.rect.center.x - rect.center.x) < rect.width / 2

			const isBelow = target.rect.center.y > rect.center.y

			if (isIntersecting && isInside && isBelow) {
				target.destroy()
				this.world.add(createPlayerSpawner(this.map))
			}
		}
	}
}
