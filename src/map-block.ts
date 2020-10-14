import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { Rect } from "./rect"
import { DrawRectTrait, RectTrait } from "./traits"
import { vec } from "./vector"

export class MapBlock extends Entity {
	constructor(left: number, top: number, width: number, height: number) {
		super([
			new RectTrait(
				new Rect(
					vec(width * worldGridScale, height * worldGridScale),
					vec(left * worldGridScale, top * worldGridScale),
				),
			),
			new DrawRectTrait(),
		])
	}

	get rect() {
		return this.get(RectTrait).rect
	}
}
