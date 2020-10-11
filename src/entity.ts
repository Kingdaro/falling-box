export abstract class Entity {
  shouldDestroy = false

  onAdded?(): void
  onRemoved?(): void
  update?(dt: number): void
  draw?(): void

  destroy() {
    this.shouldDestroy = true
  }
}

export class EntityGroup<E extends Entity = Entity> extends Entity {
  entities = new Set<E>()

  add(ent: E) {
    this.entities.add(ent)
    ent.onAdded?.()
  }

  remove(ent: E) {
    this.entities.delete(ent)
    ent.onRemoved?.()
  }

  update(dt: number) {
    for (const ent of this.entities) {
      ent.update?.(dt)
    }

    for (const ent of this.entities) {
      if (ent.shouldDestroy) {
        this.remove(ent)
      }
    }
  }

  draw() {
    for (const ent of this.entities) {
      ent.draw?.()
    }
  }
}
