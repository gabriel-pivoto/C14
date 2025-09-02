import type { TaskPriority } from './Task'

export function validateTitle(title: string): string | null {
  if (!title) return 'title is required'
  if (title.trim().length < 3) return 'title must have at least 3 characters'
  return null
}

export function validatePriority(priority: TaskPriority): string | null {
  return ['low', 'medium', 'high'].includes(priority) ? null : 'invalid priority'
}

export function validateDueDate(d?: Date): string | null {
  if (!d) return null
  const now = Date.now()
  if (Number.isNaN(d.getTime())) return 'invalid dueDate'
  if (d.getTime() < now) return 'dueDate must be in the future'
  return null
}
