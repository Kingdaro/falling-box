import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { Rect } from "./rect"
import { DrawRectTrait } from "./traits"
import { vec } from "./vector"

export class MapBlock extends Entity {
	constructor(left: number, top: number, width: number, height: number) {
		super([new DrawRectTrait()])
		this.rect = new Rect(
			vec(width * worldGridScale, height * worldGridScale),
			vec(left * worldGridScale, top * worldGridScale),
		)
	}
}
