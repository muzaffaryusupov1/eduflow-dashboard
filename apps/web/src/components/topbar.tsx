'use client';

import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './theme-toggle';
import { useAuth } from './auth-provider';

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-700 dark:text-sand-100">
          Overview
        </p>
        <h2 className="font-[var(--font-grotesk)] text-2xl font-semibold text-ink-900 dark:text-white">
          {user?.role ?? 'TEACHER'} workspace
        </h2>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-2xl border border-ink-900/10 bg-white px-3 py-2 shadow-card dark:border-white/10 dark:bg-ink-800">
            <Avatar>
              <AvatarFallback>{user?.email?.[0]?.toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium text-ink-900 dark:text-white">
                {user?.email ?? 'User'}
              </p>
              <Badge variant="outline" className="mt-1 text-xs">
                {user?.role ?? 'TEACHER'}
              </Badge>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
