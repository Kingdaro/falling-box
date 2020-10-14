import { Rect } from "./rect"
import { vec, Vector } from "./vector"

export type Collision = {
	displacement: Vector
}

export function checkCollision(
	first: Rect,
	second: Rect,
): Collision | undefined {
	if (!first.intersects(second)) return

	const displacementX =
		first.center.x < second.center.x
			? second.left - first.right
			: second.right - first.left

	const displacementY =
		first.center.y < second.center.y
			? second.top - first.bottom
			: second.bottom - first.top

	// displace by the lesser value
	const displacement =
		Math.abs(displacementX) < Math.abs(displacementY)
			? vec(displacementX, 0)
			: vec(0, displacementY)

	return { displacement }
}
