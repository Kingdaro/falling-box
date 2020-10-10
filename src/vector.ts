export class Vector {
  constructor(public readonly x: number, public readonly y: number) {}

  plus(other: Vector | number) {
    other = resolveVector(other)
    return new Vector(this.x + other.x, this.y + other.y)
  }

  minus(other: Vector | number) {
    other = resolveVector(other)
    return new Vector(this.x - other.x, this.y - other.y)
  }

  times(other: Vector | number) {
    other = resolveVector(other)
    return new Vector(this.x * other.x, this.y * other.y)
  }

  dividedBy(other: Vector | number) {
    other = resolveVector(other)
    return new Vector(this.x / other.x, this.y / other.y)
  }

  map(fn: (value: number) => number) {
    return new Vector(fn(this.x), fn(this.y))
  }

  rounded() {
    return this.map(Math.round)
  }

  components() {
    return [this.x, this.y] as const
  }
}

const resolveVector = (other: Vector | number): Vector =>
  typeof other === "number" ? new Vector(other, other) : other

export const vec = (x = 0, y = x) => new Vector(x, y)
