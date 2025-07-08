
import { useLocalStorage } from './useLocalStorage';
import { useEffect } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useLocalStorage('taskflow-theme', false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
}
