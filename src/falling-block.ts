import { CollisionTrait, DrawRectTrait, GravityTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FlyingBlockDestructionTargetTrait } from "./flying-block"
import { GrabTargetTrait } from "./player"
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
		new CollisionTrait((entity) => entity.has(FallingBlockFloorTrait)),
		new BecomeStaticTrait(),
		new GrabTargetTrait(),
		new FlyingBlockDestructionTargetTrait(),
	])

	ent.rect = new Rect(
		vec(worldGridScale),
		vec(map.getRespawnPosition(), verticalSpawnPosition),
	)

	return ent
}

class BecomeStaticTrait extends Trait {
	update() {
		const { collisions } = this.entity.get(CollisionTrait)
		if (collisions.some((col) => col.displacement.y < 0)) {
			this.entity.destroy()
			this.world.add(createStaticBlock(this.entity.rect.position))
		}
	}
}

export class FallingBlockFloorTrait extends Trait {}
