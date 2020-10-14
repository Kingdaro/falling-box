import { EntityGroup } from "./entity"
import { MapBlock, mapBlockSize } from "./map-block"
import { floorToNearest, randomRange } from "./math"

export class WorldMap extends EntityGroup<MapBlock> {
	private readonly left
	private readonly right

	constructor() {
		super()

		this.add(new MapBlock(0, 0, 40, 1))
		this.add(new MapBlock(1, 1, 38, 1))
		this.add(new MapBlock(2, 2, 36, 1))

		this.left = Math.min(...[...this.entities].map((block) => block.rect.left))
		this.right = Math.max(
			...[...this.entities].map((block) => block.rect.right),
		)
	}

	getRespawnPosition() {
		return floorToNearest(randomRange(this.left, this.right), mapBlockSize)
	}
}
