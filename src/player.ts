import { DrawRectTrait, GravityTrait, TimerTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FallingBlock } from "./falling-block"
import { FlyingBlock } from "./flying-block"
import {
	getAxis,
	isButtonDown,
	wasButtonPressed,
	wasButtonReleased,
} from "./gamepad"
import { context } from "./graphics"
import { isDown, wasPressed, wasReleased } from "./keyboard"
import { Rect } from "./rect"
import { Trait } from "./trait"
import { vec } from "./vector"
import { Collision } from "./world"
import { WorldMap } from "./world-map"

const size = 40
const gravity = 2600
const speed = 500
const jumpSpeed = 900
const maxJumps = 2
const falloutDepth = 1000
const respawnHeight = 500
const grabDistance = 50

export class Player extends Entity {
	constructor(map: WorldMap) {
		super([
			new PlayerTrait(),
			new DrawRectTrait(),
			new MovementTrait(),
			new JumpingTrait(),
			new GravityTrait(gravity),
			new PlayerPhysicsTrait(),
			new VelocityResolutionTrait(),
			new RespawnOnFalloutTrait(map),
			new GrabTrait(),
			new SquishTrait(map),
		])

		this.rect = new Rect(
			vec(size),
			vec(map.getRespawnPosition(), -respawnHeight),
		)
	}
}

class PlayerSpawner extends Entity {
	constructor(map: WorldMap) {
		super([
			new TimerTrait(2, (ent) => {
				ent.world.add(new Player(map))
				ent.destroy()
			}),
		])
	}
}

export class PlayerTrait extends Trait {}

export class PlayerCollisionTargetTrait extends Trait {}

class PlayerPhysicsTrait extends Trait {
	collisions: Collision[] = []

	get isOnGround() {
		return this.collisions.some((col) => col.displacement.y < 0)
	}

	update() {
		const result = this.world.findCollisions(this.entity, (ent) => {
			return ent.has(PlayerCollisionTargetTrait)
		})

		this.collisions = result.collisions
		this.entity.rect = result.finalRect
	}
}

class VelocityResolutionTrait extends Trait {
	update() {
		const { collisions } = this.entity.get(PlayerPhysicsTrait)
		let [xvel, yvel] = this.entity.velocity.components()

		for (const { displacement, entity } of collisions) {
			if (
				displacement.x !== 0 &&
				Math.sign(displacement.x) !== Math.sign(xvel)
			) {
				xvel = entity.velocity.x
			}

			if (
				displacement.y !== 0 &&
				Math.sign(displacement.y) !== Math.sign(yvel)
			) {
				yvel = entity.velocity.y
			}
		}

		this.entity.velocity = vec(xvel, yvel)
	}
}

class MovementTrait extends Trait {
	update() {
		this.entity.velocity = vec(movementValue() * speed, this.entity.velocity.y)
	}
}

class JumpingTrait extends Trait {
	jumps = maxJumps

	update() {
		const { isOnGround } = this.entity.get(PlayerPhysicsTrait)

		if (isOnGround) {
			this.jumps = maxJumps
		}

		if (jumpInputPressed() && this.jumps > 0) {
			this.entity.velocity = vec(this.entity.velocity.x, -jumpSpeed)
			this.jumps -= 1
		}
	}
}

class RespawnOnFalloutTrait extends Trait {
	constructor(private readonly map: WorldMap) {
		super()
	}

	update() {
		if (this.entity.rect.top > falloutDepth) {
			this.entity.rect.position = vec(
				this.map.getRespawnPosition(),
				-respawnHeight,
			)
			this.entity.velocity = vec()
		}
	}
}

class GrabTrait extends Trait {
	private direction: 1 | -1 = 1
	private grabbing = false

	update() {
		if (this.entity.velocity.x > 0 && this.direction < 0) {
			this.direction = 1
		}
		if (this.entity.velocity.x < 0 && this.direction > 0) {
			this.direction = -1
		}

		const grabPosition = this.getGrabPosition()

		if (grabInputPressed() && !this.grabbing) {
			const grabbed = this.world.entities.find((ent) => {
				return ent.has(GrabTargetTrait) && ent.rect.containsPoint(grabPosition)
			})

			if (grabbed) {
				grabbed.destroy()
				this.grabbing = true
			}
		}

		if (grabInputReleased() && this.grabbing) {
			this.grabbing = false
			this.world.add(new FlyingBlock(grabPosition, this.direction))
		}
	}

	draw() {
		const grabPosition = this.getGrabPosition()

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

	private getGrabPosition() {
		return this.entity.rect.center.plus(vec(grabDistance * this.direction, 0))
	}
}

export class GrabTargetTrait extends Trait {}

class SquishTrait extends Trait {
	constructor(private readonly map: WorldMap) {
		super()
	}

	update() {
		const { rect } = this.entity
		const { isOnGround } = this.entity.get(PlayerPhysicsTrait)

		const blocks = this.world.entities.filter(
			(ent) => ent instanceof FallingBlock,
		)

		for (const block of blocks) {
			const isIntersecting = rect.intersects(block.rect)

			const isInside =
				Math.abs(block.rect.center.x - rect.center.x) < rect.width / 2

			const isBelow = rect.top > block.rect.center.y

			if (isIntersecting && isInside && isBelow && isOnGround) {
				this.entity.destroy()
				this.world.add(new PlayerSpawner(this.map))
			}
		}
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
