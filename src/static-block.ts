import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { Rect } from "./rect"
import { DrawRectTrait, RectTrait, TimedRemovalTrait } from "./traits"
import { vec, Vector } from "./vector"

export function createStaticBlock(position: Vector) {
	return new Entity([
		new RectTrait(new Rect(vec(worldGridScale), position)),
		new DrawRectTrait(),
		new TimedRemovalTrait(15),
	])
}
