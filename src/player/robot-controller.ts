import { worldGridScale } from "../constants"
import { Entity } from "../entity"
import { context } from "../graphics"
import { Grid } from "../grid"
import { TaskId } from "../scheduler"
import { Trait } from "../trait"
import { Vector } from "../vector"
import { GrabTargetTrait, GrabTrait, MovementTrait } from "./player"

enum State {
	Idle,
	FindingBlock,
	FindingTarget,
}

const maxIdleTime = 1

export class RobotControllerTrait extends Trait {
	state = State.Idle
	idleTask?: TaskId
	debugSpaceCount = 0
	debugClosestSpace?: Vector

	update() {
		if (this.state === State.Idle) {
			this.idleTask ??= this.world.scheduler.after(maxIdleTime, () => {
				this.state = State.FindingBlock
			})
		}

		if (this.state === State.FindingBlock) {
			// create a grid of grab targets
			const grid = new Grid<Entity>()
			this.world.entities.forEach((ent) => {
				if (ent.has(GrabTargetTrait)) {
					const gridPos = ent.rect.center.map(getGridPosComponent)
					grid.set(gridPos, ent)
				}
			})

			// find all empty spaces beside grabable targets
			type EmptySpace = { pos: Vector; direction: 1 | -1 }
			const emptySpaces: EmptySpace[] = []

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

			this.debugSpaceCount = emptySpaces.length

			// find the closest empty space
			let closest: EmptySpace | undefined
			for (const space of emptySpaces) {
				const self = this.entity.rect.center
				if (
					!closest ||
					self.distanceTo(space.pos) < self.distanceTo(closest.pos)
				) {
					closest = space
				}
			}

			this.debugClosestSpace = closest?.pos

			// navigate to the empty space
			const target = closest
			if (target) {
				const movement = this.entity.get(MovementTrait)
				const grab = this.entity.get(GrabTrait)
				const self = this.entity.rect.center

				// if we're close enough to the space, face the right direction and try to grab
				if (Math.abs(target.pos.x - self.x) < 20) {
					grab.direction = target.direction
					grab.grab()

					if (grab.grabbing) {
						this.state = State.FindingTarget
					}
				}

				// if we're not close enough to the space, try to go there
				else {
					if (target.pos.x < self.x) movement.movement = -1
					if (target.pos.x > self.x) movement.movement = 1
					if (target.pos.y < self.y) movement.jump()
				}
			}
		}
	}

	drawDebug() {
		const debugText = [
			`state: ${State[this.state]}`,
			`spaces: ${this.debugSpaceCount}`,
			this.debugClosestSpace
				? `closest: ${this.debugClosestSpace.x}, ${this.debugClosestSpace.y}`
				: "",
		].join("\n")

		context.fillStyle = "white"
		context.font = "16px Arial"
		context.textBaseline = "top"
		context.fillText(debugText, 20, 20)
	}
}

const getGridPosComponent = (x: number) => Math.floor(x / worldGridScale)
