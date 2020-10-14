import { Entity } from "./entity"
import { Rect } from "./rect"
import { DrawRectTrait, RectTrait } from "./traits"
import { vec } from "./vector"

export const mapBlockSize = 50

export class MapBlock extends Entity {
	constructor(left: number, top: number, width: number, height: number) {
		super([
			new RectTrait(
				new Rect(
					vec(width * mapBlockSize, height * mapBlockSize),
					vec(left * mapBlockSize, top * mapBlockSize),
				),
			),
			new DrawRectTrait(),
		])
	}

	get rect() {
		return this.get(RectTrait).rect
	}
}
