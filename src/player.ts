import { Collision } from "./collision"
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
import { Ref, ref } from "./ref"
import {
	DrawRectTrait,
	GravityTrait,
	Trait,
	VelocityResolutionTrait,
	VelocityTrait,
} from "./traits"
import { vec, Vector } from "./vector"
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
	const position = vec(map.getRespawnPosition(), -respawnHeight)
	const rect = ref(new Rect(vec(size), position))
	const velocity = ref(vec())
	const collisions = ref<Collision[]>([])

	return new Entity([
		new VelocityTrait(rect, velocity),
		new GravityTrait(gravity, Infinity, velocity),
		// new CollisionTrait(() => [...map.entities, ...staticBlockGroup.entities]), // ???
		new VelocityResolutionTrait(velocity, collisions),
		new DrawRectTrait("white", rect),
		new MovementTrait(velocity),
		new JumpingTrait(velocity, collisions),
		new RespawnOnFalloutTrait(map, rect, velocity),
		new GrabTrait(staticBlockGroup, flyingBlockGroup, rect, velocity),
	])
}

class MovementTrait implements Trait {
	constructor(private readonly velocity: Ref<Vector>) {}

	update(ent: Entity) {
		this.velocity.value = vec(movementValue() * speed, this.velocity.value.y)
	}
}

class JumpingTrait implements Trait {
	private jumps = maxJumps

	constructor(
		private readonly velocity: Ref<Vector>,
		private readonly collisions: Ref<Collision[]>,
	) {}

	update(entity: Entity) {
		if (this.collisions.value.some((col) => col.displacement.y < 0)) {
			this.jumps = maxJumps
		}

		if (jumpInputPressed() && this.jumps > 0) {
			this.velocity.value = vec(this.velocity.value.x, -jumpSpeed)
			this.jumps -= 1
		}
	}
}

class RespawnOnFalloutTrait implements Trait {
	constructor(
		private readonly map: WorldMap,
		private readonly rect: Ref<Rect>,
		private readonly velocity: Ref<Vector>,
	) {}

	update(ent: Entity) {
		if (this.rect.value.top > falloutDepth) {
			this.rect.value.position = vec(
				this.map.getRespawnPosition(),
				-respawnHeight,
			)
			this.velocity.value = vec()
		}
	}
}

class GrabTrait implements Trait {
	private direction: 1 | -1 = 1
	private grabbing = false

	constructor(
		private readonly staticBlockGroup: EntityGroup,
		private readonly flyingBlockGroup: EntityGroup,
		private readonly rect: Ref<Rect>,
		private readonly velocity: Ref<Vector>,
	) {}

	private getGrabPosition(ent: Entity) {
		return this.rect.value.center.plus(vec(grabDistance * this.direction, 0))
	}

	update(ent: Entity) {
		if (this.velocity.value.x > 0 && this.direction < 0) {
			this.direction = 1
		}
		if (this.velocity.value.x < 0 && this.direction > 0) {
			this.direction = -1
		}

		const grabPosition = this.getGrabPosition(ent)

		if (grabInputPressed() && !this.grabbing) {
			const grabbed = this.staticBlockGroup.entities.find((ent) => {
				// ???
				// return this.rect.value.containsPoint(grabPosition)
				return false
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
