import { createEntity, createTrait } from "../entity.new"
import { Rect } from "../rect"
import { vec, Vector } from "../vector"

const size = 40
const gravity = 2600
const speed = 500
const jumpSpeed = 900
const maxJumps = 2
const falloutDepth = 1000
const respawnHeight = 500
const grabDistance = 50
const respawnTimeSeconds = 2

export function createPlayer() {
	return createEntity({
		data: {
			rect: new Rect(),
			velocity: vec(),
		},
		traits: [createGravityTrait(gravity)],
	})
}

function createGravityTrait(amount: number, terminalVelocity = Infinity) {
	return createTrait<{ velocity: Vector }>({
		update({ dt, data }) {
			data.velocity = vec(
				data.velocity.x,
				Math.min(data.velocity.y + amount * dt, terminalVelocity),
			)
		},
	})
}
