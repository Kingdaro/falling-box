export class Rect {
  constructor(
    public left: number,
    public top: number,
    public width: number,
    public height = width,
  ) {}

  get right() {
    return this.left + this.width
  }

  get bottom() {
    return this.top + this.height
  }

  get center() {
    return [this.left + this.width / 2, this.top + this.height / 2] as const
  }

  get values() {
    return [this.left, this.top, this.width, this.height] as const
  }

  get valuesRounded() {
    return [
      Math.round(this.left),
      Math.round(this.top),
      Math.round(this.width),
      Math.round(this.height),
    ] as const
  }

  setTopLeft(left: number, top: number) {
    this.left = left
    this.top = top
  }

  move(leftDelta: number, topDelta: number) {
    this.left += leftDelta
    this.top += topDelta
  }
}
