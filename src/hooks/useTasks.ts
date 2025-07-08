import { useLocalStorage } from './useLocalStorage';
import { Task, TaskFilter, TaskStats } from '../types/task';
import { v4 as uuidv4 } from 'uuid';

const FIXED_TASKS = [
  'Curso Cisco',
  'Curso Senai', 
  'Provas da faculdade',
  'Trabalhos da faculdade',
  'Documentos do projeto de extensão da faculdade',
  'Sistema do teatro',
  'Sistema de agendamento',
  'Manutenção dos sistemas no ar (ex: Contabilize)',
  'Moto (manutenção, check-ups, etc)',
  'Prestação de serviços de TI',
  'Abertura de CNPJ',
  'Registro de marca (monitorar andamento)',
  'Banda com José (treinos, aula de canto e música)',
  '200 horas de curso obrigatórias da faculdade',
  'Canal no YouTube (gravar, editar e enviar vídeos, incluindo para Xracing e Apaixonados por Motores)',
  'Saúde (médicos, dentista, exames etc.)',
  'Pagar servidor da Hostinger',
  'Parcelas do seguro da moto',
  'Boletos da cidadania da Giullia (ajuda financeira durante recuperação)'
];

function initializeTasks(): Task[] {
  return FIXED_TASKS.map(title => ({
    id: uuidv4(),
    title,
    isFixed: true,
    isCompleted: false,
    isSelectedForToday: false,
    isArchived: false,
    createdAt: new Date(),
  }));
}

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-tasks', initializeTasks());

  const addTask = (title: string, description?: string) => {
    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      isFixed: false,
      isCompleted: false,
      isSelectedForToday: false,
      isArchived: false,
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            ...updates,
            completedAt: updates.isCompleted && !task.isCompleted ? new Date() : task.completedAt
          }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTaskForToday = (id: string) => {
    updateTask(id, { 
      isSelectedForToday: !tasks.find(t => t.id === id)?.isSelectedForToday 
    });
  };

  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find(t => t.id === id);
    updateTask(id, { isCompleted: !task?.isCompleted });
  };

  const archiveTask = (id: string) => {
    updateTask(id, { isArchived: true, isSelectedForToday: false });
  };

  const unarchiveTask = (id: string) => {
    updateTask(id, { isArchived: false });
  };

  const resetTodayTasks = () => {
    setTasks(prev => prev.map(task => ({
      ...task,
      isSelectedForToday: false,
      isCompleted: false,
      completedAt: undefined
    })));
  };

  const getFilteredTasks = (filter: TaskFilter): Task[] => {
    switch (filter) {
      case 'today':
        return tasks.filter(task => task.isSelectedForToday && !task.isArchived);
      case 'completed':
        return tasks.filter(task => task.isCompleted && !task.isArchived);
      case 'archived':
        return tasks.filter(task => task.isArchived);
      default:
        return tasks.filter(task => !task.isArchived);
    }
  };

  const getTaskStats = (): TaskStats => ({
    total: tasks.filter(t => !t.isArchived).length,
    completed: tasks.filter(t => t.isCompleted && !t.isArchived).length,
    today: tasks.filter(t => t.isSelectedForToday && !t.isArchived).length,
    archived: tasks.filter(t => t.isArchived).length,
  });

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskForToday,
    toggleTaskCompletion,
    archiveTask,
    unarchiveTask,
    resetTodayTasks,
    getFilteredTasks,
    getTaskStats,
  };
}
