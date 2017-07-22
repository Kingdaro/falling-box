export class Scheduler {
  private tasks = [] as Task[]

  addTask(task: Task) {
    this.tasks.push(task)
  }

  update(dt: number) {
    this.tasks.forEach(task => {
      task.time -= dt
      if (task.time <= 0) {
        task.action()
        if (task.repeat) task.time += task.period
      }
    })
    this.tasks = this.tasks.filter(task => task.time > 0 || task.repeat)
  }
}

export class Task {
  time = this.period
  constructor(
    public period: number,
    public repeat: boolean,
    public action: () => any,
  ) {}
}
