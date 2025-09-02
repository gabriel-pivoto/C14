import type { TaskRepository } from '../ports/TaskRepository'
import { Ok, type Result } from '../utils/Result'
import type { Task } from '../domain/Task'

export class ListTasks {
  constructor(private repo: TaskRepository) {}
  async execute(): Promise<Result<Task[]>> {
    return Ok(await this.repo.list())
  }
}
