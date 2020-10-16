import { worldGridScale } from "./constants"
import { MapBlock } from "./map-block"
import { floorToNearest, randomRange } from "./math"
import { World } from "./world"

export class WorldMap {
	private readonly left
	private readonly right

	constructor(world: World) {
		const blocks = [
			world.add(new MapBlock(0, 0, 40, 1)),
			world.add(new MapBlock(1, 1, 38, 1)),
			world.add(new MapBlock(2, 2, 36, 1)),
		]

		this.left = Math.min(...[...blocks].map((block) => block.rect.left))
		this.right = Math.max(...[...blocks].map((block) => block.rect.right))
	}

	getRespawnPosition() {
		return floorToNearest(randomRange(this.left, this.right), worldGridScale)
	}
}
