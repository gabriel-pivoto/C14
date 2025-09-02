import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository';
import { CreateTask } from '../../src/usecases/CreateTask';
import { SearchTasks } from '../../src/usecases/SearchTasks';
const future = () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
describe('SearchTasks', () => {
    test('filtra por tag (positivo #6)', async () => {
        const repo = new InMemoryTaskRepository();
        const create = new CreateTask(repo);
        await create.execute({ title: 'pagar conta', tags: ['finance'] });
        await create.execute({ title: 'estudar', tags: ['study'] });
        const out = await new SearchTasks(repo).execute({ tag: 'study' });
        expect(out.ok).toBe(true);
        if (out.ok) {
            expect(out.value).toHaveLength(1);
            expect(out.value[0].title).toBe('estudar');
        }
    });
    test('filtra por prioridade (positivo #7)', async () => {
        const repo = new InMemoryTaskRepository();
        const create = new CreateTask(repo);
        await create.execute({ title: 'ler artigo', priority: 'low' });
        await create.execute({ title: 'entregar trabalho', priority: 'high' });
        const out = await new SearchTasks(repo).execute({ priority: 'high' });
        expect(out.ok).toBe(true);
        if (out.ok)
            expect(out.value[0].priority).toBe('high');
    });
    test('filtra por dueDate (positivo #8) e ignora sem dueDate', async () => {
        const repo = new InMemoryTaskRepository();
        const create = new CreateTask(repo);
        await create.execute({ title: 'com prazo', dueDate: future() });
        await create.execute({ title: 'sem prazo' });
        const until = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
        const out = await new SearchTasks(repo).execute({ until });
        expect(out.ok).toBe(true);
        if (out.ok)
            expect(out.value.every(t => !!t.dueDate)).toBe(true);
    });
    test('busca com parâmetro inválido (negativo #8)', async () => {
        const repo = new InMemoryTaskRepository();
        const search = new SearchTasks(repo);
        // @ts-expect-error intencional
        const out = await search.execute({ priority: 'urgent' });
        expect(out.ok).toBe(true); // search não valida; validação ocorre no Update/Create
    });
});
