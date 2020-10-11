import { Collider } from "./collision.old"
import { MapBlock, mapBlockSize } from "./map-block"
import { floorToNearest, randomRange } from "./math"

export class WorldMap {
  readonly blocks = [
    new MapBlock(0, 0, 40, 1),
    new MapBlock(1, 1, 38, 1),
    new MapBlock(2, 2, 36, 1),
  ] as const

  private readonly left = Math.min(
    ...this.blocks.map((block) => block.rect.left),
  )
  private readonly right = Math.max(
    ...this.blocks.map((block) => block.rect.right),
  )

  constructor(collider: Collider) {
    for (const block of this.blocks) {
      collider.add(block, ...block.rect.values)
    }
  }

  draw() {
    for (const block of this.blocks) {
      block.draw()
    }
  }

  spawnPosition() {
    return floorToNearest(randomRange(this.left, this.right), mapBlockSize)
  }
}
