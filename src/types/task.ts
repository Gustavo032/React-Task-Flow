
export interface Task {
  id: string;
  title: string;
  description?: string;
  isFixed: boolean; // true para tarefas pré-cadastradas, false para personalizadas
  isCompleted: boolean;
  isSelectedForToday: boolean;
  isArchived: boolean;
  createdAt: Date;
  completedAt?: Date;
  category?: string;
}

export type TaskFilter = 'all' | 'today' | 'completed' | 'archived' | 'history';

export interface TaskStats {
  total: number;
  completed: number;
  today: number;
  archived: number;
}

export interface TaskHistory {
  date: string;
  tasks: Task[];
  completedCount: number;
}
