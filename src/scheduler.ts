type Task = {
	currentTime: number
	period: number
	fn: () => void
	repeat?: boolean
}

export type TaskId = string

export class Scheduler {
	private tasks = new Map<TaskId, Task>()

	private addTask(time: number, fn: () => void, repeat: boolean): TaskId {
		const id = String(Math.random())
		this.tasks.set(id, { currentTime: time, period: time, fn, repeat })
		return id
	}

	after(time: number, fn: () => void): TaskId {
		return this.addTask(time, fn, false)
	}

	repeat(time: number, fn: () => void): TaskId {
		return this.addTask(time, fn, true)
	}

	cancel(id: TaskId) {
		this.tasks.delete(id)
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
