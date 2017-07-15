export class GameObject {
  xvel = 0
  yvel = 0
  gravity = 0

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height = width,
  ) {}

  get center() {
    const x = this.x + this.width / 2
    const y = this.y + this.height / 2
    return { x, y }
  }

  applyGravity(dt: number) {
    this.yvel += this.gravity * dt
  }

  applyVelocity(dt: number) {
    this.x += this.xvel * dt
    this.y += this.yvel * dt
  }

  update(dt: number) {
    this.applyGravity(dt)
    this.applyVelocity(dt)
  }

  collidesWith(other: GameObject) {
    return (
      this.x + this.width > other.x &&
      this.x < other.x + other.width &&
      this.y + this.height > other.y &&
      this.y < other.y + other.height
    )
  }

  getDisplacement(other: GameObject) {
    const x =
      this.center.x < other.center.x
        ? other.x - (this.x + this.width)
        : other.x + other.width - this.x

    const y =
      this.center.y < other.center.y
        ? other.y - (this.y + this.height)
        : other.y + other.height - this.y

    return { x, y }
  }

  getMinimumDisplacement(other: GameObject) {
    const { x, y } = this.getDisplacement(other)
    return Math.abs(x) < Math.abs(y) ? { x, y: 0 } : { y, x: 0 }
  }

  resolveCollision(other: GameObject) {
    if (!this.collidesWith(other)) return false

    const disp = this.getMinimumDisplacement(other)

    this.x += disp.x
    this.y += disp.y

    if (disp.x !== 0 && Math.sign(this.xvel) !== Math.sign(disp.x)) {
      this.xvel = 0
    }

    if (disp.y !== 0 && Math.sign(this.yvel) !== Math.sign(disp.y)) {
      this.yvel = 0
    }

    return true
  }

  resolveGroupCollision(others: GameObject[]) {
    const resolved = Array.from(others)
      .sort((a, b) => this.distanceTo(a) - this.distanceTo(b))
      .filter(other => this.resolveCollision(other))
    return resolved.length > 0
  }

  distanceTo(other: GameObject) {
    return Math.sqrt((other.x - this.x) ** 2 + (other.y - this.y) ** 2)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}
