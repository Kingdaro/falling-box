import { DrawRectTrait, TimerTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FallingBlockFloorTrait } from "./falling-block"
import { FlyingBlockDestructionTargetTrait } from "./flying-block"
import { GrabTargetTrait, PlayerCollisionTargetTrait } from "./player"
import { Rect } from "./rect"
import { vec, Vector } from "./vector"

export class StaticBlock extends Entity {
	constructor(position: Vector) {
		super([
			new DrawRectTrait(),
			new TimerTrait(15, (ent) => ent.destroy()),
			new FlyingBlockDestructionTargetTrait(),
			new FallingBlockFloorTrait(),
			new PlayerCollisionTargetTrait(),
			new GrabTargetTrait(),
		])

		this.rect = new Rect(vec(worldGridScale), position)
	}
}
