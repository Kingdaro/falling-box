export class Clock {
	time = 0

	constructor(private readonly period: number) {}

	advance(dt: number) {
		this.time += dt
		if (this.time >= this.period) {
			this.time -= this.period
			return true
		}
		return false
	}
}
