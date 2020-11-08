import { Camera } from "./camera"
import { FallingBlock } from "./falling-block"
import { canvas, context } from "./graphics"
import { HumanControllerTrait } from "./player/human-controller"
import { Player } from "./player/player"
import { RobotControllerTrait } from "./player/robot-controller"
import { vec } from "./vector"
import { World } from "./world"
import { WorldMap } from "./world-map"

const cameraStiffness = 8
const cameraOffset = vec(0, -150)

export class Game {
	world = new World()
	map = new WorldMap(this.world)
	camera = new Camera()

	constructor() {
		this.world.add(new Player(this.map).attach(HumanControllerTrait))
		this.world.add(new Player(this.map).attach(RobotControllerTrait))

		this.world.scheduler.repeat(0.3, () => {
			this.world.add(new FallingBlock(this.map))
		})
	}

	update(dt: number) {
		this.world.update(dt)

		const player = this.world.entities.find((e) => e.has(HumanControllerTrait))
		if (player) {
			this.camera.moveTowards(
				player.rect.center.plus(cameraOffset),
				dt * cameraStiffness,
			)
		}
	}

	draw() {
		context.clearRect(0, 0, canvas.width, canvas.height)

		this.camera.apply(() => {
			this.world.draw()
		})
	}
}
