'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, GraduationCap, CreditCard } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { navItems } from '@/lib/roles';
import { useAuth } from './auth-provider';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard className="h-4 w-4" />,
  People: <Users className="h-4 w-4" />,
  Classes: <GraduationCap className="h-4 w-4" />,
  Billing: <CreditCard className="h-4 w-4" />
};

type SidebarProps = {
  forceVisible?: boolean;
};

export function Sidebar({ forceVisible = false }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const visibleItems = navItems.filter((item) =>
    item.roles ? item.roles.includes(user?.role ?? 'TEACHER') : true
  );

  return (
    <aside
      className={cn(
        'h-full w-full flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm md:flex md:w-[270px] md:sticky md:top-6',
        forceVisible ? 'flex' : 'hidden'
      )}
    >
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">
          EduFlow
        </p>
        <p className="text-lg font-semibold tracking-tight">
          Control Center
        </p>
      </div>
      <Separator />
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
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <span className="flex items-center gap-2">
                {iconMap[item.label] ?? null}
                {item.label}
              </span>
              {item.badge && <Badge variant="outline">{item.badge}</Badge>}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-2">
        <p className="text-xs text-muted-foreground">Signed in as</p>
        <p className="text-sm font-medium text-foreground">
          {user?.email ?? 'Unknown'}
        </p>
      </div>
    </aside>
  );
}
