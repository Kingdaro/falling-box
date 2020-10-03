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

  get components() {
    return [this.left, this.top, this.width, this.height] as const
  }
}
