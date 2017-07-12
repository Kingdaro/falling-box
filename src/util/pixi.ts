import * as pixi from 'pixi.js'

export function createRect(width: number, height = width) {
  const sprite = new pixi.Graphics()
  sprite.beginFill(0xffffff)
  sprite.drawRect(0, 0, width, height)
  sprite.endFill()
  return sprite
}
