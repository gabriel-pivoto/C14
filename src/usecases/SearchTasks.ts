import type { TaskRepository } from '../ports/TaskRepository'
import { Ok, type Result } from '../utils/Result'
import type { Task } from '../domain/Task'

export class SearchTasks {
  constructor(private repo: TaskRepository) {}
  async execute(params: { tag?: string; priority?: Task['priority']; until?: Date }): Promise<Result<Task[]>> {
    return Ok(await this.repo.search(params))
  }
}
