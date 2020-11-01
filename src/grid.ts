import { vec, Vector } from "./vector"

type NumRecord<T> = { [key: number]: T }

export class Grid<T> {
	private items: NumRecord<NumRecord<T | undefined>> = {}

	set({ x, y }: Vector, item: T) {
		const col = (this.items[x] ??= [])
		return (col[y] = item)
	}

	get({ x, y }: Vector): T | undefined {
		return this.items[x]?.[y]
	}

	delete({ x, y }: Vector) {
		const col = this.items[x]
		if (col) col[y] = undefined
	}

	*entries() {
		for (const [x, col] of Object.entries(this.items)) {
			if (!col) continue
			for (const [y, item] of Object.entries(col)) {
				if (item !== undefined) {
					yield [item, vec(Number(x), Number(y))] as const
				}
			}
		}
	}
}
