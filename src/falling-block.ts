import { Entity, EntityGroup } from "./entity"
import { mapBlockSize } from "./map-block"
import { Rect } from "./rect"
import {
  CollisionTrait,
  DrawRectTrait,
  GravityTrait,
  RectTrait,
  VelocityTrait,
} from "./traits"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const verticalSpawnPosition = -1500
const gravity = 800
const terminalVelocity = 800

export function createFallingBlock(map: WorldMap, fallingBlocks: EntityGroup) {
  return new Entity([
    new RectTrait(
      new Rect(
        vec(mapBlockSize),
        vec(map.getRespawnPosition(), verticalSpawnPosition),
      ),
    ),
    new DrawRectTrait(),
    new VelocityTrait(),
    new GravityTrait(gravity, terminalVelocity),
    new CollisionTrait(() => [...map.entities, ...fallingBlocks.entities]),
  ])
}
