'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'eduflow.theme';

type Theme = 'light' | 'dark';

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored ?? 'light';
    setTheme(initial);
    applyTheme(initial);
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        window.localStorage.setItem(STORAGE_KEY, next);
        applyTheme(next);
      }}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="mr-2 h-4 w-4" /> Light
        </>
      ) : (
        <>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </>
      )}
    </Button>
  );
}
