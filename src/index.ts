import { InMemoryTaskRepository } from './infra/InMemoryTaskRepository'
import { CreateTask } from './usecases/CreateTask'

async function main () {
  const repo = new InMemoryTaskRepository()
  const create = new CreateTask(repo)
  const res = await create.execute({ title: 'hello tests', tags: ['demo'] })
  console.log("Rodando IHUL")
}

if (process.env.NODE_ENV !== 'test') {
  main()
}
