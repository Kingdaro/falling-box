import { DrawRectTrait, TimedRemovalTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FallingBlockFloorTrait } from "./falling-block"
import { FlyingBlockDestructionTargetTrait } from "./flying-block"
import { GrabTargetTrait, PlayerCollisionTargetTrait } from "./player"
import { Rect } from "./rect"
import { vec, Vector } from "./vector"

export function createStaticBlock(position: Vector) {
	const ent = new Entity([
		new DrawRectTrait(),
		new TimedRemovalTrait(15),
		new FlyingBlockDestructionTargetTrait(),
		new FallingBlockFloorTrait(),
		new PlayerCollisionTargetTrait(),
		new GrabTargetTrait(),
	])

	ent.rect = new Rect(vec(worldGridScale), position)

	return ent
}
