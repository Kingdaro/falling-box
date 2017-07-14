function animationFrame() {
  return new Promise<number>(requestAnimationFrame)
}

export const viewWidth = 1280
export const viewHeight = 720

export class Game {
  view = document.createElement('canvas')
  private renderer = this.view.getContext('2d')
  private state = new GameState()

  constructor() {
    this.view.style.backgroundColor = 'black'
    this.view.width = viewWidth
    this.view.height = viewHeight
    this.view.tabIndex = 0

    this.view.onkeydown = event => {
      if (event.repeat) return
      this.state.keydown(event)
    }

    this.view.onkeyup = event => {
      if (event.repeat) return
      this.state.keyup(event)
    }
  }

  async start() {
    if (this.renderer == null) {
      throw new Error('Could not get 2d canvas context')
    }

    let currentTime = await animationFrame()
    while (true) {
      const frameTime = await animationFrame()
      const elapsed = (frameTime - currentTime) / 1000
      currentTime = frameTime
      this.state.update(elapsed)
      this.renderer.clearRect(0, 0, this.view.width, this.view.height)
      this.state.draw(this.renderer)
    }
  }

  setState(state: GameState) {
    state.game = this
    this.state.leave()
    this.state = state
    this.state.enter()
  }
}

export class GameState {
  game: Game
  enter() {}
  leave() {}
  update(dt: number) {}
  draw(ctx: CanvasRenderingContext2D) {}
  keyup(event: KeyboardEvent) {}
  keydown(event: KeyboardEvent) {}
}
