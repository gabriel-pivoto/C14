export type TaskStatus = 'pending' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  tags: string[]
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export const createTaskEntity = (input: {
  id: string
  title: string
  description?: string
  priority?: TaskPriority
  tags?: string[]
  dueDate?: Date
}): Task => {
  const now = new Date()
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    status: 'pending',
    priority: input.priority ?? 'medium',
    tags: input.tags ?? [],
    dueDate: input.dueDate,
    createdAt: now,
    updatedAt: now
  }
}
