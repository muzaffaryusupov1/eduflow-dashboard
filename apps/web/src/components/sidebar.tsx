'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { navItems } from '@/lib/roles';
import { useAuth } from './auth-provider';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navItems.filter((item) =>
    item.roles ? item.roles.includes(user?.role ?? 'TEACHER') : true
  );

  return (
    <aside className="hidden h-full flex-col gap-6 rounded-3xl border border-ink-900/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-ink-800 md:flex">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.4em] text-ink-700 dark:text-sand-100">
          EduFlow
        </p>
        <p className="font-[var(--font-grotesk)] text-lg font-semibold text-ink-900 dark:text-white">
          Control Center
        </p>
      </div>
      <Separator className="dark:bg-white/10" />
      <nav className="space-y-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-xl px-3 py-2 text-sm transition',
                active
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                  : 'text-ink-700 hover:bg-sand-100 dark:text-sand-100 dark:hover:bg-white/10'
              )}
            >
              <span>{item.label}</span>
              {item.badge && <Badge variant="outline">{item.badge}</Badge>}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-2">
        <p className="text-xs text-ink-700 dark:text-sand-100">Signed in as</p>
        <p className="text-sm font-medium text-ink-900 dark:text-white">
          {user?.email ?? 'Unknown'}
        </p>
      </div>
    </aside>
  );
}
