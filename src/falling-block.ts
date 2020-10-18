import { DrawRectTrait, GravityTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FlyingBlockDestructionTargetTrait } from "./flying-block"
import { GrabTargetTrait, PlayerCollisionTargetTrait } from "./player"
import { Rect } from "./rect"
import { StaticBlock } from "./static-block"
import { Trait } from "./trait"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const verticalSpawnPosition = -1500
const gravity = 800
const terminalVelocity = 800

export class FallingBlock extends Entity {
	constructor(map: WorldMap) {
		super([
			new DrawRectTrait(),
			new GravityTrait(gravity, terminalVelocity),
			new BecomeStaticTrait(),
			new GrabTargetTrait(),
			new FlyingBlockDestructionTargetTrait(),
			new PlayerCollisionTargetTrait(),
		])

		this.rect = new Rect(
			vec(worldGridScale),
			vec(map.getRespawnPosition(), verticalSpawnPosition),
		)
	}
}

export class FallingBlockFloorTrait extends Trait {}

class BecomeStaticTrait extends Trait {
	update() {
		const { finalRect, collisions } = this.world.findCollisions(
			this.entity,
			(ent) => ent.has(FallingBlockFloorTrait),
		)

		if (collisions.some((col) => col.displacement.y < 0)) {
			this.entity.destroy()
			this.world.add(new StaticBlock(finalRect.position))
		}
	}
}
