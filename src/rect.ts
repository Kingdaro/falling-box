import { vec, Vector } from "./vector"

export class Rect {
	constructor(public size: Vector, public position = vec()) {}

	intersects(other: Rect) {
		return (
			this.right > other.left &&
			this.left < other.right &&
			this.bottom > other.top &&
			this.top < other.bottom
		)
	}

	withPosition(position: Vector) {
		return new Rect(this.size, position)
	}

	containsPoint(point: Vector) {
		return (
			point.x > this.left &&
			point.x < this.right &&
			point.y > this.top &&
			point.y < this.bottom
		)
	}

	get width() {
		return this.size.x
	}

	get height() {
		return this.size.y
	}

	get left() {
		return this.position.x
	}

	get top() {
		return this.position.y
	}

	get right() {
		return this.left + this.width
	}

	get bottom() {
		return this.top + this.height
	}

	get center() {
		return this.position.plus(this.size.dividedBy(2))
	}

	get values() {
		return [...this.position.components(), ...this.size.components()] as const
	}

	get valuesRounded() {
		return [
			...this.position.rounded().components(),
			...this.size.rounded().components(),
		] as const
	}
}
