import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository'
import { CreateTask } from '../../src/usecases/CreateTask'
import { CompleteTask } from '../../src/usecases/CompleteTask'

describe('CompleteTask', () => {
  test('completa tarefa pendente (positivo #4)', async () => {
    const repo = new InMemoryTaskRepository()
    const created = await new CreateTask(repo).execute({ title: 'Fazer testes' })
    if (!created.ok) throw new Error('setup')
    const out = await new CompleteTask(repo).execute(created.value.id)
    expect(out.ok).toBe(true)
    if (out.ok) expect(out.value.status).toBe('done')
  })

  test('não permite completar já concluída (negativo #6)', async () => {
    const repo = new InMemoryTaskRepository()
    const created = await new CreateTask(repo).execute({ title: 'Ler docs' })
    if (!created.ok) throw new Error('setup')
    await new CompleteTask(repo).execute(created.value.id)
    const out = await new CompleteTask(repo).execute(created.value.id)
    expect(out.ok).toBe(false)
  })
})
