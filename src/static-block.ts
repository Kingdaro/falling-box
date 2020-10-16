import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { Rect } from "./rect"
import { DrawRectTrait, TimedRemovalTrait } from "./traits"
import { vec, Vector } from "./vector"

export function createStaticBlock(position: Vector) {
	const ent = new Entity([new DrawRectTrait(), new TimedRemovalTrait(15)])

	ent.rect = new Rect(vec(worldGridScale), position)

	return ent
}
