import { Ok, Err, type Result } from '../utils/Result'
import { createTaskEntity, type Task, type TaskPriority } from '../domain/Task'
import { validateDueDate, validatePriority, validateTitle } from '../domain/TaskValidators'
import type { TaskRepository } from '../ports/TaskRepository'

export interface CreateTaskInput {
  title: string
  description?: string
  priority?: TaskPriority
  tags?: string[]
  dueDate?: Date
}

export class CreateTask {
  constructor(private repo: TaskRepository) {}
  async execute(input: CreateTaskInput): Promise<Result<Task>> {
    const titleErr = validateTitle(input.title) //<===========
    if (titleErr) return Err(titleErr)//<==========
    const prioErr = validatePriority(input.priority ?? 'medium')
    if (prioErr) return Err(prioErr)
    const dueErr = validateDueDate(input.dueDate)
    if (dueErr) return Err(dueErr)

    const entity = createTaskEntity({
      id: crypto.randomUUID(),
      title: input.title.trim(),
      description: input.description?.trim(),
      priority: input.priority ?? 'medium',
      tags: input.tags ?? [],
      dueDate: input.dueDate
    })
    await this.repo.create(entity)
    return Ok(entity)
  }
}
