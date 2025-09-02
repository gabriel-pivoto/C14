import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository'
import { CreateTask } from '../../src/usecases/CreateTask'
import { DeleteTask } from '../../src/usecases/DeleteTask'

const setup = async () => {
  const repo = new InMemoryTaskRepository()
  const res = await new CreateTask(repo).execute({ title: 'Excluir depois' })
  if (!res.ok) throw new Error('setup failed')
  return { repo, id: res.value.id }
}

describe('DeleteTask', () => {
  test('exclui tarefa existente (positivo #5)', async () => {
    const { repo, id } = await setup()
    const out = await new DeleteTask(repo).execute(id)
    expect(out.ok).toBe(true)
    expect((await repo.list()).length).toBe(0)
  })

  test('falha ao excluir inexistente (negativo #7)', async () => {
    const repo = new InMemoryTaskRepository()
    const out = await new DeleteTask(repo).execute('missing')
    expect(out.ok).toBe(false)
    if (!out.ok) expect(out.error).toBe('NotFound')
  })
})
