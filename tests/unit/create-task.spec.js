import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository';
import { CreateTask } from '../../src/usecases/CreateTask';
const future = () => new Date(Date.now() + 24 * 60 * 60 * 1000);
describe('CreateTask', () => {
    test('cria tarefa válida (positivo #1)', async () => {
        const repo = new InMemoryTaskRepository();
        const usecase = new CreateTask(repo);
        const out = await usecase.execute({ title: 'Estudar Vitest', dueDate: future(), tags: ['study'] });
        expect(out.ok).toBe(true);
        if (out.ok) {
            expect(out.value.status).toBe('pending');
            expect(out.value.id).toBeTypeOf('string');
        }
        expect((await repo.list()).length).toBe(1);
    });
    test('title curto deve falhar (negativo #1)', async () => {
        const repo = new InMemoryTaskRepository();
        const usecase = new CreateTask(repo);
        const out = await usecase.execute({ title: 'ok' });
        expect(out.ok).toBe(false);
        if (!out.ok)
            expect(out.error).toMatch('least 3');
    });
    test('dueDate no passado deve falhar (negativo #2)', async () => {
        const repo = new InMemoryTaskRepository();
        const usecase = new CreateTask(repo);
        const past = new Date(Date.now() - 1000);
        const out = await usecase.execute({ title: 'Teste', dueDate: past });
        expect(out.ok).toBe(false);
        if (!out.ok)
            expect(out.error).toMatch('future');
    });
    test('prioridade inválida deve falhar (negativo #3)', async () => {
        const repo = new InMemoryTaskRepository();
        const usecase = new CreateTask(repo);
        // @ts-expect-error intencional para teste de validação
        const out = await usecase.execute({ title: 'Teste', priority: 'ultra' });
        expect(out.ok).toBe(false);
    });
});
