import type { TaskPriority } from '../domain/Task'
import type { TaskRepository } from '../ports/TaskRepository'
import { Err, Ok, type Result } from '../utils/Result'
import { validateDueDate, validatePriority, validateTitle } from '../domain/TaskValidators'
import type { Task } from '../domain/Task'

export class UpdateTask {
  constructor(private repo: TaskRepository) {}
  async execute(id: string, data: { title?: string; description?: string; priority?: TaskPriority; tags?: string[]; dueDate?: Date }): Promise<Result<Task>> {
    const current = await this.repo.findById(id)
    if (!current) return Err('NotFound')

    if (data.title !== undefined) {
      const e = validateTitle(data.title)
      if (e) return Err(e)
      current.title = data.title
    }
    if (data.priority !== undefined) {
      const e = validatePriority(data.priority)
      if (e) return Err(e)
      current.priority = data.priority
    }
    if (data.dueDate !== undefined) {
      const e = validateDueDate(data.dueDate)
      if (e) return Err(e)
      current.dueDate = data.dueDate
    }
    if (data.description !== undefined) current.description = data.description
    if (data.tags !== undefined) current.tags = data.tags

    current.updatedAt = new Date()
    await this.repo.update(current)
    return Ok(current)
  }
}
