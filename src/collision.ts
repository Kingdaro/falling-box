import { Body, MoveFilter, ResponseType, World } from "bopit"
import { raise } from "./helpers"

type ColliderFilterFn = (
  obj: object,
  ...args: Parameters<MoveFilter>
) => ResponseType | undefined

// https://github.com/tanema/bopit#usage
export class Collider {
  private readonly world
  private readonly bodiesByObject = new WeakMap<object, Body>()
  private readonly objectsByBody = new WeakMap<Body, object>()

  constructor(cellSize?: number) {
    this.world = new World(cellSize)
  }

  add(obj: object, left: number, top: number, width: number, height: number) {
    const body = new Body(left, top, width, height)
    this.bodiesByObject.set(obj, body)
    this.objectsByBody.set(body, obj)
    body.add(this.world)
  }

  move(obj: object, left: number, top: number, filter?: ColliderFilterFn) {
    const body = this.bodiesByObject.get(obj) ?? raise("body not found")
    return body.move(left, top, (body, ...args) => {
      if (!filter) return "slide"
      const obj = this.objectsByBody.get(body) ?? raise("object not found")
      return filter(obj, body, ...args)
    })
  }

  remove(obj: object) {
    const body = this.bodiesByObject.get(obj)
    if (body) {
      this.bodiesByObject.delete(obj)
      this.objectsByBody.delete(body)
      body.destroy()
    }
  }
}
