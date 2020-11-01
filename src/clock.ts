export class Clock {
	time = 0

	private constructor(
		private readonly period: number,
		private readonly shouldRepeat: boolean,
	) {}

	static single(period: number) {
		return new Clock(period, false)
	}

	static repeating(period: number) {
		return new Clock(period, true)
	}

	advance(dt: number) {
		if (this.time >= this.period) {
			if (this.shouldRepeat) this.time -= this.period
			return true
		}

		this.time += dt
		return false
	}

	reset() {
		this.time = 0
	}
}
