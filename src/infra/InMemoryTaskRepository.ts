import type { Task } from '../domain/Task'
import type { TaskRepository } from '../ports/TaskRepository'

export class InMemoryTaskRepository implements TaskRepository {
  public items: Task[] = []

  async create(task: Task): Promise<void> {
    this.items.push(structuredClone(task))
  }
  async findById(id: string): Promise<Task | null> {
    return this.items.find(t => t.id === id) ?? null
  }
  async update(task: Task): Promise<void> {
    const idx = this.items.findIndex(t => t.id === task.id)
    if (idx === -1) throw new Error('NotFound')
    this.items[idx] = structuredClone(task)
  }
  async delete(id: string): Promise<void> {
    const before = this.items.length
    this.items = this.items.filter(t => t.id != id)
    if (this.items.length == before) throw new Error('NotFound')
  }
  async list(): Promise<Task[]> {
    return [...this.items]
  }
  async search(params: { tag?: string; priority?: Task['priority']; until?: Date }): Promise<Task[]> {
    return this.items.filter(t => {
      const byTag = params.tag ? t.tags.includes(params.tag) : true
      const byPriority = params.priority ? t.priority === params.priority : true
      const byDueDate = params.until ? (t.dueDate ? t.dueDate.getTime() <= params.until.getTime() : false) : true
      return byTag && byPriority && byDueDate
    })
  }
}
