import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository'
import { CreateTask } from '../../src/usecases/CreateTask'
import { UpdateTask } from '../../src/usecases/UpdateTask'

const mk = async () => {
  const repo = new InMemoryTaskRepository()
  const created = await new CreateTask(repo).execute({ title: 'AAA' })
  if (!created.ok) throw new Error('setup failed')
  return { repo, id: created.value.id }
}

describe('UpdateTask', () => {
  test('atualiza título (positivo #2)', async () => {
    const { repo, id } = await mk()
    const out = await new UpdateTask(repo).execute(id, { title: 'Novo título' })
    expect(out.ok).toBe(true)
    if (out.ok) expect(out.value.title).toBe('Novo título')
  })

  test('falha ao atualizar tarefa inexistente (negativo #4)', async () => {
    const repo = new InMemoryTaskRepository()
    const out = await new UpdateTask(repo).execute('missing', { title: 'xxx' })
    expect(out.ok).toBe(false)
    if (!out.ok) expect(out.error).toBe('NotFound')
  })

  test('não permite título inválido (negativo #5)', async () => {
    const { repo, id } = await mk()
    const out = await new UpdateTask(repo).execute(id, { title: 'no' })
    expect(out.ok).toBe(false)
  })

  test('atualiza prioridade válida (positivo #3)', async () => {
    const { repo, id } = await mk()
    const out = await new UpdateTask(repo).execute(id, { priority: 'high' })
    expect(out.ok).toBe(true)
    if (out.ok) expect(out.value.priority).toBe('high')
  })
})
