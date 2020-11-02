import { DrawRectTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FallingBlockFloorTrait } from "./falling-block"
import { FlyingBlockDestructionTargetTrait } from "./flying-block"
import { GrabTargetTrait, PlayerPhysicsTargetTrait } from "./player/player"
import { Rect } from "./rect"
import { vec, Vector } from "./vector"

export class StaticBlock extends Entity {
	constructor(position: Vector) {
		super([
			new DrawRectTrait(),
			new FlyingBlockDestructionTargetTrait(),
			new FallingBlockFloorTrait(),
			new PlayerPhysicsTargetTrait(),
			new GrabTargetTrait(),
		])

		this.rect = new Rect(vec(worldGridScale), position)
	}

	onAdded() {
		this.world.scheduler.after(15, () => this.destroy())
	}
}
