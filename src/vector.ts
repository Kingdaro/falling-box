export class Vector {
  constructor(public readonly x: number, public readonly y: number) {}

  withX(value: number) {
    return new Vector(value, this.y)
  }

  withY(value: number) {
    return new Vector(this.x, value)
  }

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

  distanceTo(other: Vector) {
    return Math.sqrt((this.x - other.x) ** 2 + (this.y - other.y) ** 2)
  }

  dotProduct(other: Vector) {
    return this.x * other.y + this.y * other.x
  }
}

export const vec = (x = 0, y = x) => new Vector(x, y)

const resolveVector = (other: Vector | number): Vector =>
  typeof other === "number" ? new Vector(other, other) : other
