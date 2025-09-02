import type { Task } from '../domain/Task'

export interface TaskRepository {
  create(task: Task): Promise<void>
  findById(id: string): Promise<Task | null>
  update(task: Task): Promise<void>
  delete(id: string): Promise<void>
  list(): Promise<Task[]>
  search(params: { tag?: string; priority?: Task['priority']; until?: Date }): Promise<Task[]>
}
