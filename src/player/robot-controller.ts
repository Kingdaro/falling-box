import { worldGridScale } from "../constants"
import { Entity } from "../entity"
import { Grid } from "../grid"
import { Trait, TraitArgs, TraitUpdateArgs } from "../trait"
import { Vector } from "../vector"
import { GrabTargetTrait, GrabTrait, MovementTrait } from "./player"

const maxIdleTime = 1

type RobotState = {
	onEnter?: (args: TraitArgs) => void | undefined | (() => void)
	update?: (args: TraitUpdateArgs) => void
}

export class RobotControllerTrait extends Trait {
	currentState?: RobotState
	currentCleanup?: () => void

	idleState: RobotState = {
		onEnter: (args) => {
			const task = args.world.scheduler.after(maxIdleTime, () => {
				this.setState(this.findingBlockState, args)
			})
			return task.cancel
		},
	}

	findingBlockState: RobotState = {
		onEnter: ({ world }) => {
			const task = world.scheduler.repeat(0.3, () => {
				this.tryGrabBlock()
			})
			return task.cancel
		},
	}

	update(args: TraitUpdateArgs) {
		if (!this.currentState) {
			this.setState(this.idleState, args)
		}
		this.currentState?.update?.(args)
	}

	setState(state: RobotState, args: TraitArgs) {
		this.currentCleanup?.()

		this.currentState = state
		this.currentCleanup = state.onEnter?.(args) || undefined
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
					this.setState(this.idleState)
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
