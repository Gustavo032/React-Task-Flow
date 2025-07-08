import { Task } from '../types/task';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { 
  Check, 
  Calendar, 
  Archive, 
  Trash2, 
  Edit,
  MoreVertical,
  Star
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleToday: (id: string) => void;
  onToggleCompletion: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  showTodayToggle?: boolean;
}

export function TaskCard({ 
  task, 
  onToggleToday, 
  onToggleCompletion, 
  onArchive, 
  onDelete, 
  onEdit,
  showTodayToggle = true
}: TaskCardProps) {
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      task.isCompleted ? 'bg-muted/50' : 'bg-card'
    } ${task.isSelectedForToday ? 'ring-2 ring-primary/20' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              checked={task.isCompleted}
              onCheckedChange={() => onToggleCompletion(task.id)}
              className="mt-1"
            />
            <div className="flex-1">
              <h3 className={`font-medium text-sm leading-tight ${
                task.isCompleted ? 'line-through text-muted-foreground' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {task.isFixed && (
              <Badge variant="secondary" className="text-xs px-2">
                <Star className="w-3 h-3 mr-1" />
                Fixa
              </Badge>
            )}
            
            {task.isSelectedForToday && (
              <Badge variant="default" className="text-xs px-2">
                <Calendar className="w-3 h-3 mr-1" />
                Hoje
              </Badge>
            )}
            
            {task.isCompleted && (
              <Badge variant="outline" className="text-xs px-2 text-green-600 border-green-200">
                <Check className="w-3 h-3 mr-1" />
                Feito
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showTodayToggle && !task.isArchived && (
              <Button
                variant={task.isSelectedForToday ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleToday(task.id)}
                className="text-xs"
              >
                <Calendar className="w-3 h-3 mr-1" />
                {task.isSelectedForToday ? 'Remover do Dia' : 'Adicionar ao Dia'}
              </Button>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onArchive(task.id)}>
                <Archive className="w-4 h-4 mr-2" />
                Arquivar
              </DropdownMenuItem>
              {!task.isFixed && (
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
