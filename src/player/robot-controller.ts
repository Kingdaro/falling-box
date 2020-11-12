import { worldGridScale } from "../constants"
import { Entity } from "../entity"
import { Grid } from "../grid"
import { TaskHandle } from "../scheduler"
import { StateMachine, StateMachineState } from "../state-machine"
import { Trait } from "../trait"
import { Vector } from "../vector"
import { World } from "../world"
import { GrabTargetTrait, GrabTrait, MovementTrait } from "./player"

const maxIdleTime = 1

export class RobotControllerTrait extends Trait {
	machine?: StateMachine

	constructor() {
		super()

		setTimeout(() => {
			this.machine = new StateMachine([
				new IdleState(this.world),
				new FindingBlockState(this.world, this.entity),
			])
			this.machine.setState(IdleState)
		})
	}

	update(dt: number) {
		this.machine?.update(dt)
	}
}

class IdleState extends StateMachineState {
	constructor(private readonly world: World) {
		super()
	}

	onEnter() {
		this.world.scheduler.after(maxIdleTime, () => {
			this.machine.setState(FindingBlockState)
		})
	}
}

class FindingBlockState extends StateMachineState {
	// grabSpace?: GrabSpace
	private task?: TaskHandle

	constructor(private readonly world: World, private readonly entity: Entity) {
		super()
	}

	onEnter() {
		this.task = this.world.scheduler.repeat(0.3, () => {
			this.tryGrabBlock()
		})
	}

	onExit() {
		this.task?.cancel()
	}

	tryGrabBlock() {
		// create a grid of grab targets
		const grid = new Grid<Entity>()

		const getGridPosComponent = (x: number) => Math.floor(x / worldGridScale)

		this.world.entities.forEach((ent) => {
			if (ent.has(GrabTargetTrait)) {
				const gridPos = ent.rect.center.map(getGridPosComponent)
				grid.set(gridPos, ent)
			}
		})

		// find all empty spaces beside grabable targets
		type GrabSpace = { pos: Vector; direction: 1 | -1 }
		const emptySpaces: GrabSpace[] = []

		const getWorldPos = (gridPos: Vector) =>
			gridPos.times(worldGridScale).plus(worldGridScale / 2)

		for (const [, gridPos] of grid.entries()) {
			const left = gridPos.plus(Vector.left)
			if (!grid.get(left)) {
				emptySpaces.push({ pos: getWorldPos(left), direction: 1 })
			}

			const right = gridPos.plus(Vector.right)
			if (!grid.get(right)) {
				emptySpaces.push({ pos: getWorldPos(right), direction: -1 })
			}
		}

		// find the closest empty space
		let closest: GrabSpace | undefined
		for (const space of emptySpaces) {
			const self = this.entity.rect.center
			if (
				!closest ||
				self.distanceTo(space.pos) < self.distanceTo(closest.pos)
			) {
				closest = space
			}
		}

		// navigate to the empty space
		const target = closest
		if (target) {
			const movement = this.entity.get(MovementTrait)
			const grab = this.entity.get(GrabTrait)
			const self = this.entity.rect.center
			const distance = Math.abs(target.pos.x - self.x)

			// if we're close enough to the space, face the right direction and try to grab
			if (distance < 20) {
				grab.direction = target.direction
				grab.grab()

				if (grab.grabbing) {
					this.machine.setState(IdleState)
				}
			}

			// if we're not close enough to the space, try to go there
			else {
				if (target.pos.x < self.x) movement.movement = -1
				if (target.pos.x > self.x) movement.movement = 1
				if (target.pos.y < self.y && distance < 50) movement.jump()
			}
		}
	}
}
