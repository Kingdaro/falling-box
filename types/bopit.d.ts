declare module "bopit" {
  export class World {
    constructor(cellSize?: number)
    queryRect(left: number, top: number, width: number, height: number): Body[]
    queryPoint(left: number, top: number): Body[]
    querySegment(x1: number, y1: number, x2: number, y2: number): Body[]
  }

  export class Body {
    constructor(left: number, top: number, width: number, height: number)
    x: number
    y: number
    w: number
    h: number
    add(world: World): void
    destroy(): void
    move(left: number, top: number, filter?: MoveFilter): MoveResult
    check(left: number, top: number, filter?: MoveFilter): MoveResult
    distanceTo(other: Body): number
  }

  export type Collision = {
    intersection: number
    normal: { x: number; y: number }
    touch: { x: number; y: number }
    move: { x: number; y: number }
    respType: ResponseType
    body: Body
    distance: number
  }

  export type MoveFilter = (
    body: Body,
    collision: Collision,
    goalX: number,
    goalY: number,
  ) => ResponseType | undefined

  export type MoveResult = [
    finalX: number,
    finalY: number,
    collisions: Collision[],
  ]

  export type ResponseType = "touch" | "cross" | "slide" | "bounce"
}
