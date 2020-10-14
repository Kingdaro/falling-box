import { worldGridScale } from "./constants"
import { Entity, EntityGroup } from "./entity"
import { Rect } from "./rect"
import { createStaticBlock } from "./static-block"
import {
	CollisionTrait,
	DrawRectTrait,
	GravityTrait,
	RectTrait,
	Trait,
	VelocityTrait,
} from "./traits"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const verticalSpawnPosition = -1500
const gravity = 800
const terminalVelocity = 800

export function createFallingBlock(
	map: WorldMap,
	staticBlockGroup: EntityGroup,
) {
	return new Entity([
		new RectTrait(
			new Rect(
				vec(worldGridScale),
				vec(map.getRespawnPosition(), verticalSpawnPosition),
			),
		),
		new DrawRectTrait(),
		new VelocityTrait(),
		new GravityTrait(gravity, terminalVelocity),
		new CollisionTrait(() => [...map.entities, ...staticBlockGroup.entities]),
		new BecomeStaticTrait(staticBlockGroup),
	])
}

class BecomeStaticTrait implements Trait {
	constructor(private readonly staticBlockGroup: EntityGroup) {}

	update(ent: Entity) {
		const { rect } = ent.get(RectTrait)
		const { collisions } = ent.get(CollisionTrait)
		if (collisions.some((col) => col.displacement.y < 0)) {
			ent.destroy()
			this.staticBlockGroup.add(createStaticBlock(rect.position))
		}
	}
}
