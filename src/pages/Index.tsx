import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskFilter, Task } from '../types/task';
import { Header } from '../components/Header';
// import { StatsCards } from '../components/StatsCards';
import { TaskCard } from '../components/TaskCard';
import { AddTaskDialog } from '../components/AddTaskDialog';
import { EditTaskDialog } from '../components/EditTaskDialog';
import { TaskHistory } from '../components/TaskHistory';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  List, 
  Calendar, 
  CheckCircle, 
  Archive, 
  Search,
  X,
  History
} from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { StatsCards } from '@/components/StatsCard';

const Index = () => {
  const {
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
  } = useTasks();

  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const stats = getTaskStats();
  const filteredTasks = getFilteredTasks(activeFilter);
  
  const searchedTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddTask = (title: string, description?: string) => {
    addTask(title, description);
    toast({
      title: "Tarefa adicionada!",
      description: `"${title}" foi adicionada à sua lista.`,
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setEditDialogOpen(true);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    updateTask(id, updates);
    toast({
      title: "Tarefa atualizada!",
      description: "As alterações foram salvas.",
    });
  };

  const handleDeleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    deleteTask(id);
    toast({
      title: "Tarefa excluída!",
      description: `"${task?.title}" foi removida permanentemente.`,
    });
  };

  const handleArchiveTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    archiveTask(id);
    toast({
      title: "Tarefa arquivada!",
      description: `"${task?.title}" foi arquivada.`,
    });
  };

  const handleUnarchiveTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    unarchiveTask(id);
    toast({
      title: "Tarefa desarquivada!",
      description: `"${task?.title}" foi desarquivada.`,
    });
  };

  const handleToggleTaskForToday = (id: string) => {
    const task = tasks.find(t => t.id === id);
    toggleTaskForToday(id);
    
    if (task?.isSelectedForToday) {
      toast({
        title: "Tarefa removida do dia!",
        description: `"${task.title}" foi removida das tarefas de hoje.`,
      });
    } else {
      toast({
        title: "Tarefa adicionada ao dia!",
        description: `"${task?.title}" foi adicionada às tarefas de hoje.`,
      });
    }
  };

  const handleToggleTaskCompletion = (id: string) => {
    const task = tasks.find(t => t.id === id);
    toggleTaskCompletion(id);
    
    if (task?.isCompleted) {
      toast({
        title: "Tarefa reaberta!",
        description: `"${task.title}" foi marcada como pendente.`,
      });
    } else {
      toast({
        title: "Tarefa concluída! 🎉",
        description: `Parabéns! "${task?.title}" foi concluída.`,
      });
    }
  };

  const handleResetToday = () => {
    resetTodayTasks();
    toast({
      title: "Dia resetado!",
      description: "Todas as tarefas foram desmarcadas do dia atual.",
    });
  };

  const tabsConfig = [
    {
      value: 'all',
      label: 'Todas',
      icon: List,
      count: stats.total,
    },
    {
      value: 'today',
      label: 'Hoje',
      icon: Calendar,
      count: stats.today,
    },
    {
      value: 'completed',
      label: 'Concluídas',
      icon: CheckCircle,
      count: stats.completed,
    },
    {
      value: 'archived',
      label: 'Arquivadas',
      icon: Archive,
      count: stats.archived,
    },
    {
      value: 'history',
      label: 'Histórico',
      icon: History,
      count: 0,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header onResetToday={handleResetToday} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />
        
        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <AddTaskDialog onAddTask={handleAddTask} />
          </div>

          <Tabs 
            value={activeFilter} 
            onValueChange={(value) => setActiveFilter(value as TaskFilter)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              {tabsConfig.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  className="flex items-center gap-2"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.value !== 'history' && (
                    <Badge variant="secondary" className="text-xs">
                      {tab.count}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            {tabsConfig.slice(0, 4).map((tab) => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <div className="space-y-4">
                  {searchedTasks.length === 0 ? (
                    <div className="text-center py-12">
                      <tab.icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">
                        {searchTerm ? 'Nenhuma tarefa encontrada' : `Nenhuma tarefa ${tab.label.toLowerCase()}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm 
                          ? 'Tente buscar por outros termos'
                          : tab.value === 'all' 
                            ? 'Comece adicionando uma nova tarefa'
                            : `Você não possui tarefas ${tab.label.toLowerCase()}`
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {searchedTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggleToday={handleToggleTaskForToday}
                          onToggleCompletion={handleToggleTaskCompletion}
                          onArchive={tab.value === 'archived' ? handleUnarchiveTask : handleArchiveTask}
                          onDelete={handleDeleteTask}
                          onEdit={handleEditTask}
                          showTodayToggle={tab.value !== 'today'}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}

            <TabsContent value="history" className="mt-6">
              <TaskHistory tasks={tasks} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <EditTaskDialog
        task={editingTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  );
};

export default Index;
