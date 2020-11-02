type Task = {
	currentTime: number
	period: number
	fn: () => void
	repeat?: boolean
}

type TaskId = string

export type TaskHandle = {
	cancel: () => void
}

export class Scheduler {
	private tasks = new Map<TaskId, Task>()

	private add(time: number, fn: () => void, repeat: boolean): TaskHandle {
		const id = String(Math.random())

		this.tasks.set(id, { currentTime: time, period: time, fn, repeat })

		return {
			cancel: () => this.remove(id),
		}
	}

	private remove(id: TaskId) {
		this.tasks.delete(id)
	}

	after(time: number, fn: () => void): TaskHandle {
		return this.add(time, fn, false)
	}

	repeat(time: number, fn: () => void): TaskHandle {
		return this.add(time, fn, true)
	}

	update(dt: number) {
		for (const [id, task] of this.tasks) {
			task.currentTime -= dt
			if (task.currentTime <= 0) {
				task.fn()
				if (task.repeat) {
					task.currentTime += task.period
				} else {
					this.tasks.delete(id)
				}
			}
		}
	}
}
