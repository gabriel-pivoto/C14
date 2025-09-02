import type { TaskRepository } from '../ports/TaskRepository'
import { Err, Ok, type Result } from '../utils/Result'

export class DeleteTask {
  constructor(private repo: TaskRepository) {}
  async execute(id: string): Promise<Result<true>> {
    try {
      await this.repo.delete(id)
      return Ok(true)
    } catch (e) {
      return Err('NotFound')
    }
  }
}
