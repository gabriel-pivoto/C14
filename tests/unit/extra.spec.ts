import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository'
import { CreateTask } from '../../src/usecases/CreateTask'
import { DeleteTask } from '../../src/usecases/DeleteTask'
import { ListTasks } from '../../src/usecases/ListTasks'

describe('Extras para completar 20 testes', () => {
  test('cria duas tarefas e os ids são únicos (positivo)', async () => {
    const repo = new InMemoryTaskRepository()
    const create = new CreateTask(repo)

    const a = await create.execute({ title: 'tarefa A' })
    const b = await create.execute({ title: 'tarefa B' })

    if (!a.ok || !b.ok) throw new Error('setup')

    expect(a.value.id).not.toBe(b.value.id)

    const list = await new ListTasks(repo).execute()
    expect(list.ok).toBe(true)
    if (list.ok) expect(list.value).toHaveLength(2)
  })

  test('excluir a mesma tarefa duas vezes retorna NotFound (negativo)', async () => {
    const repo = new InMemoryTaskRepository()
    const create = new CreateTask(repo)
    const del = new DeleteTask(repo)

    const created = await create.execute({ title: 'para excluir' })
    if (!created.ok) throw new Error('setup')

    const first = await del.execute(created.value.id)
    expect(first.ok).toBe(true)

    const second = await del.execute(created.value.id)
    expect(second.ok).toBe(false)
    if (!second.ok) expect(second.error).toBe('NotFound')
  })
})
