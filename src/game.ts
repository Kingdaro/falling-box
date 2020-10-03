import { Camera } from "./camera"
import { Collider } from "./collision"
import { canvas, context } from "./graphics"
import { mapBlockSize } from "./map-block"
import { Player } from "./player"
import { WorldMap } from "./world-map"

const cameraStiffness = 8

export class Game {
  collider = new Collider(mapBlockSize)
  map = new WorldMap(this.collider)
  player = new Player(this.collider, this.map)
  camera = new Camera()

  update(dt: number) {
    this.player.update(dt, this.collider, this.map)
    this.camera.moveTowards(...this.player.rect.center, dt * cameraStiffness)
  }

  draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    this.camera.apply(() => {
      this.map.draw()
      this.player.draw()
    })
  }
}
