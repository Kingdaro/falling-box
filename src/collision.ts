import { Rect } from "./rect"

// https://www.gamedev.net/articles/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084/
export function sweptAABB(
  moving: Rect,
  [xvel, yvel]: [number, number],
  collided: Rect,
) {
  let xInvEntry, yInvEntry
  let xInvExit, yInvExit

  // find the distance between the objects on the near and far sides for both x and y
  if (xvel > 0) {
    xInvEntry = collided.left - moving.right
    xInvExit = collided.right - moving.left
  } else {
    xInvEntry = collided.right - moving.left
    xInvExit = collided.left - moving.right
  }

  if (yvel > 0) {
    yInvEntry = collided.top - moving.bottom
    yInvExit = collided.bottom - moving.top
  } else {
    yInvEntry = collided.bottom - moving.top
    yInvExit = collided.top - moving.bottom
  }

  // find time of collision and time of leaving for each axis (if statement is to prevent divide by zero)
  let xEntry, yEntry
  let xExit, yExit

  if (xvel === 0) {
    xEntry = -Infinity
    xExit = Infinity
  } else {
    xEntry = xInvEntry / xvel
    xExit = xInvExit / xvel
  }

  if (yvel === 0) {
    yEntry = -Infinity
    yExit = Infinity
  } else {
    yEntry = yInvEntry / yvel
    yExit = yInvExit / yvel
  }

  // find the earliest/latest times of collisionfloat
  let entryTime = Math.max(xEntry, yEntry)
  let exitTime = Math.min(xExit, yExit)

  let xnormal, ynormal, collisionTime

  // if there was no collision
  if (
    entryTime > exitTime ||
    (xEntry < 0 && yEntry < 0) ||
    xEntry > 1 ||
    yEntry > 1
  ) {
    xnormal = 0
    ynormal = 0
    collisionTime = 1
  }
  // if there was a collision
  else {
    // calculate normal of collided surface
    if (xEntry > yEntry) {
      if (xInvEntry < 0) {
        xnormal = 1
        ynormal = 0
      } else {
        xnormal = -1
        ynormal = 0
      }
    } else {
      if (yInvEntry < 0) {
        xnormal = 0
        ynormal = 1
      } else {
        xnormal = 0
        ynormal = -1
      }
    }
    collisionTime = entryTime
  }

  return { xnormal, ynormal, collisionTime }
}

export function resolveSliding(
  moving: Rect,
  [xvel, yvel]: [number, number],
  collided: Rect,
) {
  const { xnormal, ynormal, collisionTime } = sweptAABB(
    moving,
    [xvel, yvel],
    collided,
  )

  const newX = moving.left + xvel * collisionTime
  const newY = moving.top + yvel * collisionTime
  const remainingTime = 1 - collisionTime

  // const dotprod = xvel * ynormal + yvel * xnormal
}
