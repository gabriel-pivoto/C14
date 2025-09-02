import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository'
import { ListTasks } from '../../src/usecases/ListTasks'
import { CreateTask } from '../../src/usecases/CreateTask'
import { UpdateTask } from '../../src/usecases/UpdateTask'

it('lista inicialmente vazio (positivo #9)', async () => {
  const repo = new InMemoryTaskRepository()
  const out = await new ListTasks(repo).execute()
  expect(out.ok).toBe(true)
  if (out.ok) expect(out.value).toHaveLength(0)
})

it('erro do repositório é propagado de update (negativo #9)', async () => {
  const repo = new InMemoryTaskRepository()
  const created = await new CreateTask(repo).execute({ title: 'xxx' })
  if (!created.ok) throw new Error('setup')
  const bad = { ...repo, update: vi.fn().mockRejectedValue(new Error('boom')) }
  await expect(
    new UpdateTask(bad as any).execute(created.value.id, { title: 'novo' })
  ).rejects.toThrow()
})
