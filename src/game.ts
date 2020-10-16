import { Camera } from "./camera"
import { Clock } from "./clock"
import { EntityGroup } from "./entity"
import { createFallingBlock } from "./falling-block"
import { canvas, context } from "./graphics"
import { createPlayer } from "./player"
import { RectTrait } from "./traits"
import { vec } from "./vector"
import { WorldMap } from "./world-map"

const cameraStiffness = 8
const cameraOffset = vec(0, -150)

export class Game extends EntityGroup {
	blockSpawnClock = new Clock(0.3)
	map = this.add(new WorldMap())
	staticBlockGroup = this.add(new EntityGroup())
	flyingBlockGroup = this.add(new EntityGroup())
	player = this.add(
		createPlayer(this.map, this.staticBlockGroup, this.flyingBlockGroup),
	)
	fallingBlockGroup = this.add(new EntityGroup())
	camera = new Camera()

	update(dt: number) {
		super.update(dt)

		this.camera.moveTowards(
			this.player.get(RectTrait).rect.center.plus(cameraOffset),
			dt * cameraStiffness,
		)

		while (this.blockSpawnClock.advance(dt)) {
			this.fallingBlockGroup.add(
				createFallingBlock(this.map, this.staticBlockGroup),
			)
		}
	}

	draw() {
		context.clearRect(0, 0, canvas.width, canvas.height)

		this.camera.apply(() => {
			super.draw()
		})
	}
}
