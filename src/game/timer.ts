export class Timer {
  private currentTime = 0

  constructor(private period: number) {}

  update(dt: number) {
    this.currentTime += dt
    if (this.currentTime > this.period) {
      this.currentTime -= this.period
      return true
    }
    return false
  }
}
