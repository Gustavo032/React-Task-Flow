import { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Task } from '../types/task';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, CheckCircle2 } from 'lucide-react';

interface TaskHistoryProps {
  tasks: Task[];
}

export function TaskHistory({ tasks }: TaskHistoryProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Obter tarefas concluídas
  const completedTasks = tasks.filter(task => task.completedAt);

  // Obter tarefas concluídas na data selecionada
  const tasksForSelectedDate = completedTasks.filter(task => 
    task.completedAt && isSameDay(new Date(task.completedAt), selectedDate)
  );

  // Obter dias com tarefas concluídas no mês atual
  const daysWithCompletedTasks = completedTasks
    .filter(task => {
      if (!task.completedAt) return false;
      const taskDate = new Date(task.completedAt);
      return taskDate >= startOfMonth(selectedMonth) && taskDate <= endOfMonth(selectedMonth);
    })
    .map(task => new Date(task.completedAt!));

  // Calcular estatísticas do mês
  const monthStats = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  }).map(day => {
    const dayTasks = completedTasks.filter(task => 
      task.completedAt && isSameDay(new Date(task.completedAt), day)
    );
    return {
      date: day,
      tasksCount: dayTasks.length,
      tasks: dayTasks
    };
  });

  const totalCompletedInMonth = monthStats.reduce((sum, day) => sum + day.tasksCount, 0);
  const daysWithActivity = monthStats.filter(day => day.tasksCount > 0).length;

  return (
    <div className="space-y-6">
      {/* Estatísticas do mês */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletedInMonth}</div>
            <p className="text-xs text-muted-foreground">
              em {format(selectedMonth, 'MMMM yyyy', { locale: ptBR })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dias Ativos</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysWithActivity}</div>
            <p className="text-xs text-muted-foreground">
              dias com atividade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Diária</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysWithActivity > 0 ? (totalCompletedInMonth / daysWithActivity).toFixed(1) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              tarefas por dia ativo
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendário */}
        <Card>
          <CardHeader>
            <CardTitle>Calendário de Atividades</CardTitle>
            <CardDescription>
              Clique em uma data para ver as tarefas concluídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              onMonthChange={setSelectedMonth}
              month={selectedMonth}
              modifiers={{
                completed: daysWithCompletedTasks,
              }}
              modifiersStyles={{
                completed: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: 'bold',
                },
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Detalhes da data selecionada */}
        <Card>
          <CardHeader>
            <CardTitle>
              {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <CardDescription>
              {tasksForSelectedDate.length > 0 
                ? `${tasksForSelectedDate.length} tarefa(s) concluída(s)`
                : 'Nenhuma tarefa concluída neste dia'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="font-medium">{task.title}</p>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.isFixed && (
                        <Badge variant="secondary" className="text-xs">
                          Fixa
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(task.completedAt!), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma tarefa foi concluída nesta data</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
