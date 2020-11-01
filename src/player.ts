import { DrawRectTrait, GravityTrait, TimerTrait } from "./common-traits"
import { worldGridScale } from "./constants"
import { Entity } from "./entity"
import { FallingBlock } from "./falling-block"
import { FlyingBlock } from "./flying-block"
import { context } from "./graphics"
import { GamepadAxisInput, GamepadButtonInput } from "./input/gamepad"
import { Controller, Input } from "./input/input"
import { KeyboardInput } from "./input/keyboard"
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
const respawnTimeSeconds = 2

export class Player extends Entity {
	constructor(map: WorldMap, controller: Trait) {
		const traits = [
			new DrawRectTrait("cornflowerblue"),
			new MovementTrait(),
			new GravityTrait(gravity),
			new PlayerPhysicsTrait(),
			new RespawnTrait(map),
			new FalloutTrait(),
			new GrabTrait(),
			new SquishTrait(),
			new DeathTrait(),
			controller,
		]

		super(traits)

		this.rect = new Rect(
			vec(size),
			vec(map.getRespawnPosition(), -respawnHeight),
		)
	}
}

export class PlayerPhysicsTargetTrait extends Trait {}

export class DeathTrait extends Trait {
	kill() {
		let player = this.entity
		this.entity.destroy()
		this.entity.get(GrabTrait).release()

		const spawner = new Entity([
			new TimerTrait(respawnTimeSeconds, () => {
				player.get(RespawnTrait).respawn()
				this.world.add(player)
				spawner.destroy()
			}),
		])

		this.world.add(spawner)
	}
}

class PlayerPhysicsTrait extends Trait {
	collisions: Collision[] = []

	get isOnGround() {
		return this.collisions.some((col) => col.displacement.y < 0)
	}

	update() {
		const { collisions, finalRect } = this.world.findCollisions(
			this.entity,
			(ent) => ent.has(PlayerPhysicsTargetTrait),
		)

		this.collisions = collisions
		this.entity.rect = finalRect

		// resolve velocity
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
	movement = 0
	jumps = maxJumps
	
	update() {
		this.entity.velocity = vec(this.movement * speed, this.entity.velocity.y)
		const { isOnGround } = this.entity.get(PlayerPhysicsTrait)
		if (isOnGround) {
			this.jumps = maxJumps
		}
	}


	jump() {
		if (this.jumps > 0) {
			this.entity.velocity = vec(this.entity.velocity.x, -jumpSpeed)
			this.jumps -= 1
		}
	}
}


class GrabTrait extends Trait {
	// consider splitting this value out into a DirectionTrait or a FacingTrait
	// if this becomes relevant for more than grabbing
	private direction: 1 | -1 = 1

	private grabbing = false

	update() {
		if (this.entity.velocity.x > 0 && this.direction < 0) {
			this.direction = 1
		}
		if (this.entity.velocity.x < 0 && this.direction > 0) {
			this.direction = -1
		}
	}

	grab() {
		const grabPosition = this.getGrabPosition()
		if (!this.grabbing) {
			const grabbed = this.world.entities.find((ent) => {
				return ent.has(GrabTargetTrait) && ent.rect.containsPoint(grabPosition)
			})

			if (grabbed) {
				grabbed.destroy()
				this.grabbing = true
			}
		}
	}

	release() {
		const grabPosition = this.getGrabPosition()
		if (this.grabbing) {
			this.grabbing = false
			this.world.add(new FlyingBlock(grabPosition, this.direction, this.entity))
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

class RespawnTrait extends Trait {
	constructor(private readonly map: WorldMap) {
		super()
	}

	respawn() {
		this.entity.rect.position = vec(
			this.map.getRespawnPosition(),
			-respawnHeight,
		)
		this.entity.velocity = vec()
	}
}

class FalloutTrait extends Trait {
	update() {
		if (this.entity.rect.top > falloutDepth) {
			this.entity.get(DeathTrait).kill()
		}
	}
}

class SquishTrait extends Trait {
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
				this.entity.get(DeathTrait).kill()
			}
		}
	}
}

export class HumanControllerTrait extends Trait {
	private readonly controller = new Controller({
		left: Input.combined(
			GamepadAxisInput.negative("leftX"),
			new GamepadButtonInput("dpadLeft"),
			new KeyboardInput("ArrowLeft"),
		),

		right: Input.combined(
			GamepadAxisInput.positive("leftX"),
			new GamepadButtonInput("dpadRight"),
			new KeyboardInput("ArrowRight"),
		),

		jump: Input.combined(
			new GamepadButtonInput("a"),
			new KeyboardInput("ArrowUp"),
		),

		grab: Input.combined(
			new GamepadButtonInput("x"),
			new KeyboardInput("KeyZ"),
		),
	})

	update() {
		const { left, right, jump, grab } = this.controller.update()

		const movement = this.entity.get(MovementTrait)
		movement.movement = right.value - left.value

		if (jump.wasPressed) {
			movement.jump()
		}

		const grabbing = this.entity.get(GrabTrait)
		if (grab.wasPressed) grabbing.grab()
		if (grab.wasReleased) grabbing.release()
	}
}
