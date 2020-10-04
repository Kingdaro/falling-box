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

export class EntityGroup {
  entities = new Set<Entity>()

  add(ent: Entity) {
    this.entities.add(ent)
    ent.onAdded?.()
  }

  remove(ent: Entity) {
    this.entities.delete(ent)
    ent.onRemoved?.()
  }

  update(dt: number) {
    for (const ent of this.entities) {
      ent.update?.(dt)
    }

    for (const ent of this.entities) {
      if (ent.shouldDestroy) {
        this.entities.delete(ent)
      }
    }
  }

  draw() {
    for (const ent of this.entities) {
      ent.draw?.()
    }
  }
}
