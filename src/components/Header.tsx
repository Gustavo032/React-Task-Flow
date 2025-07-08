import { useTheme } from '@/hooks/use-theme';
import { Button } from './ui/button';
// import { useTheme } from '../hooks/useTheme';
import { Sun, Moon, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onResetToday: () => void;
}

export function Header({ onResetToday }: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              TaskFlow
            </h1>
            <p className="text-sm text-muted-foreground">
              Gerenciador de tarefas diárias
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onResetToday}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar Dia
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {isDark ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
