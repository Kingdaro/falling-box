import { DrawRectTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FallingBlockFloorTrait } from "./falling-block"
import { PlayerCollisionTargetTrait } from "./player"
import { Rect } from "./rect"
import { vec } from "./vector"

export class MapBlock extends Entity {
	constructor(left: number, top: number, width: number, height: number) {
		super([
			new DrawRectTrait(),
			new FallingBlockFloorTrait(),
			new PlayerCollisionTargetTrait(),
		])
		this.rect = new Rect(
			vec(width * worldGridScale, height * worldGridScale),
			vec(left * worldGridScale, top * worldGridScale),
		)
	}
}
