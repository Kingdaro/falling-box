import { worldGridScale } from "./constants"
import { Entity, EntityGroup } from "./entity"
import { createFlyingBlock } from "./flying-block"
import {
	getAxis,
	isButtonDown,
	wasButtonPressed,
	wasButtonReleased,
} from "./gamepad"
import { context } from "./graphics"
import { isDown, wasPressed, wasReleased } from "./keyboard"
import { Rect } from "./rect"
import {
	CollisionTrait,
	DrawRectTrait,
	GravityTrait,
	Trait,
	VelocityResolutionTrait,
} from "./traits"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const size = 40
const gravity = 2600
const speed = 500
const jumpSpeed = 900
const maxJumps = 2
const falloutDepth = 1000
const respawnHeight = 500
const grabDistance = 50

export function createPlayer(
	map: WorldMap,
	staticBlockGroup: EntityGroup,
	flyingBlockGroup: EntityGroup,
) {
	const ent = new Entity([
		new PlayerTrait(),
		new DrawRectTrait(),
		new MovementTrait(),
		new JumpingTrait(),
		new GravityTrait(gravity),
		new CollisionTrait(() => [...map.entities, ...staticBlockGroup.entities]),
		new VelocityResolutionTrait(),
		new RespawnOnFalloutTrait(map),
		new GrabTrait(staticBlockGroup, flyingBlockGroup),
	])

	ent.rect = new Rect(vec(size), vec(map.getRespawnPosition(), -respawnHeight))

	return ent
}

export class PlayerTrait implements Trait {}

class MovementTrait implements Trait {
	update(ent: Entity) {
		ent.velocity = vec(movementValue() * speed, ent.velocity.y)
	}
}

class JumpingTrait implements Trait {
	jumps = maxJumps

	update(ent: Entity) {
		const { collisions } = ent.get(CollisionTrait)

		if (collisions.some((col) => col.displacement.y < 0)) {
			this.jumps = maxJumps
		}

		if (jumpInputPressed() && this.jumps > 0) {
			ent.velocity = vec(ent.velocity.x, -jumpSpeed)
			this.jumps -= 1
		}
	}
}

class RespawnOnFalloutTrait implements Trait {
	constructor(private readonly map: WorldMap) {}

	update(ent: Entity) {
		if (ent.rect.top > falloutDepth) {
			ent.rect.position = vec(this.map.getRespawnPosition(), -respawnHeight)
			ent.velocity = vec()
		}
	}
}

class GrabTrait implements Trait {
	private direction: 1 | -1 = 1
	private grabbing = false

	constructor(
		private readonly staticBlockGroup: EntityGroup,
		private readonly flyingBlockGroup: EntityGroup,
	) {}

	private getGrabPosition(ent: Entity) {
		return ent.rect.center.plus(vec(grabDistance * this.direction, 0))
	}

	update(ent: Entity) {
		if (ent.velocity.x > 0 && this.direction < 0) {
			this.direction = 1
		}
		if (ent.velocity.x < 0 && this.direction > 0) {
			this.direction = -1
		}

		const grabPosition = this.getGrabPosition(ent)

		if (grabInputPressed() && !this.grabbing) {
			const grabbed = this.staticBlockGroup.entities.find((ent) => {
				const { rect } = ent
				return rect.containsPoint(grabPosition)
			})

			if (grabbed) {
				grabbed.destroy()
				this.grabbing = true
			}
		}

		if (grabInputReleased() && this.grabbing) {
			this.grabbing = false
			this.flyingBlockGroup.add(
				createFlyingBlock(grabPosition, this.direction, this.staticBlockGroup),
			)
		}
	}

	draw(ent: Entity) {
		const grabPosition = this.getGrabPosition(ent)

		context.save()
		context.fillStyle = "white"

		if (this.grabbing) {
			context.fillRect(
				...grabPosition
					.minus(worldGridScale / 2)
					.rounded()
					.components(),
				worldGridScale,
				worldGridScale,
			)
		} else {
			context.globalAlpha = 0.3

			context.beginPath()
			context.arc(...grabPosition.rounded().components(), 3, 0, Math.PI * 2)
			context.closePath()
			context.fill()
		}

		context.restore()
	}
}

const movementValue = () => {
	const axis = getAxis("leftX")
	if (axis !== 0) return axis

	let value = 0
	if (isButtonDown("dpadLeft") || ["ArrowLeft", "KeyA"].some(isDown)) {
		value -= 1
	}
	if (isButtonDown("dpadRight") || ["ArrowRight", "KeyR"].some(isDown)) {
		value += 1
	}
	return value
}

const jumpInputPressed = () => wasButtonPressed("a") || wasPressed("ArrowUp")

const grabInputPressed = () =>
	wasPressed("KeyZ") || wasButtonPressed("x") || wasButtonPressed("b")

const grabInputReleased = () =>
	wasReleased("KeyZ") || wasButtonReleased("x") || wasButtonReleased("b")
