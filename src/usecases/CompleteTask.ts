import type { TaskRepository } from '../ports/TaskRepository'
import { Err, Ok, type Result } from '../utils/Result'
import type { Task } from '../domain/Task'

export class CompleteTask {
  constructor(private repo: TaskRepository) {}
  async execute(id: string): Promise<Result<Task>> {
    const current = await this.repo.findById(id)
    if (!current) return Err('NotFound')
    if (current.status === 'done') return Err('Task already completed')
    current.status = 'done'
    current.completedAt = new Date()
    current.updatedAt = new Date()
    await this.repo.update(current)
    return Ok(current)
  }
}
