import { Rect } from "./rect"
import { vec, Vector } from "./vector"

// https://www.gamedev.net/articles/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084

type Collision = {
  normal: Vector
  distance: number
  movementDelta: Vector
}

type Resolution = {
  finalPosition: Vector
  normal: Vector
}

export function getCollision(
  movingRect: Rect,
  targetRect: Rect,
  targetPosition: Vector,
): Collision | undefined {
  const movementDelta = targetPosition.minus(movingRect.position)

  const xInvEntry =
    movementDelta.x > 0
      ? targetRect.left - movingRect.right
      : targetRect.right - movingRect.left

  const xInvExit =
    movementDelta.x > 0
      ? targetRect.right - movingRect.left
      : targetRect.left - movingRect.right

  const yInvEntry =
    movementDelta.y > 0
      ? targetRect.top - movingRect.bottom
      : targetRect.bottom - movingRect.top

  const yInvExit =
    movementDelta.y > 0
      ? targetRect.bottom - movingRect.top
      : targetRect.top - movingRect.bottom

  const xEntry = movementDelta.x === 0 ? Infinity : xInvEntry / movementDelta.x
  const xExit = movementDelta.x === 0 ? Infinity : xInvExit / movementDelta.x
  const yEntry = movementDelta.y === 0 ? Infinity : yInvEntry / movementDelta.y
  const yExit = movementDelta.y === 0 ? Infinity : yInvExit / movementDelta.y

  const entryTime = Math.max(xEntry, yEntry)
  const exitTime = Math.min(xExit, yExit)

  // no collision
  if (
    entryTime > exitTime ||
    (xEntry < 0 && yEntry < 0) ||
    xEntry > 1 ||
    yEntry > 1
  ) {
    return undefined
  }

  if (xEntry > yEntry) {
    return {
      normal: vec(Math.sign(xInvEntry), 0),
      distance: entryTime,
      movementDelta,
    }
  } else {
    return {
      normal: vec(0, Math.sign(yInvEntry)),
      distance: entryTime,
      movementDelta,
    }
  }
}

export function resolveTouch(
  movingRect: Rect,
  targetRect: Rect,
  targetPosition: Vector,
): Resolution | undefined {
  const collision = getCollision(movingRect, targetRect, targetPosition)
  if (!collision) return

  return {
    normal: collision.normal,
    finalPosition: movingRect.position.plus(
      collision.movementDelta.times(collision.distance),
    ),
  }
}

export function resolveSlide(
  movingRect: Rect,
  targetRect: Rect,
  targetPosition: Vector,
): Resolution | undefined {
  const collision = getCollision(movingRect, targetRect, targetPosition)
  if (!collision) return

  const remainingDistance = 1 - collision.distance
  const dotProduct = collision.movementDelta.dotProduct(collision.normal)

  const finalPosition = movingRect.position
    .plus(collision.movementDelta.times(collision.distance))
    .plus(collision.normal.times(dotProduct * remainingDistance))

  return {
    normal: collision.normal,
    finalPosition,
  }
}
