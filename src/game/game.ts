import * as pixi from 'pixi.js'

export type InteractionEvent = pixi.interaction.InteractionEvent

export class Game {
  private state = new GameState()

  constructor(public app: pixi.Application) {
    app.ticker.add(dt => this.state.update(dt / 60))

    app.view.tabIndex = 0
    app.view.onkeydown = event => this.state.keydown(event)
    app.view.onkeyup = event => this.state.keyup(event)

    const interaction = new pixi.interaction.InteractionManager(app.renderer)
    interaction.addListener('pointerdown', (event: InteractionEvent) => this.state.pointerdown(event))
    interaction.addListener('pointerup', (event: InteractionEvent) => this.state.pointerup(event))
    interaction.addListener('pointermove', (event: InteractionEvent) => this.state.pointermove(event))
  }

  setState(state: GameState) {
    state.game = this
    this.app.stage.removeChildren()
    this.state.leave()
    this.state = state
    this.state.enter()
  }
}

export class GameState {
  game: Game

  get app() {
    return this.game.app
  }

  get stage() {
    return this.app.stage
  }

  enter() {}
  leave() {}
  update(dt: number) {}
  keyup(event: KeyboardEvent) {}
  keydown(event: KeyboardEvent) {}
  pointerdown(event: InteractionEvent) {}
  pointerup(event: InteractionEvent) {}
  pointermove(event: InteractionEvent) {}
}
