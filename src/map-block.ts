import { DrawRectTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FallingBlockFloorTrait } from "./falling-block"
import { PlayerPhysicsTargetTrait } from "./player/player"
import { Rect } from "./rect"
import { vec } from "./vector"

export class MapBlock extends Entity {
	constructor(left: number, top: number, width: number, height: number) {
		super()

		this.attach(DrawRectTrait, { color: "white" })
			.attach(FallingBlockFloorTrait)
			.attach(PlayerPhysicsTargetTrait)

		this.rect = new Rect(
			vec(width * worldGridScale, height * worldGridScale),
			vec(left * worldGridScale, top * worldGridScale),
		)
	}
}
