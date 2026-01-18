'use client';

import { usePathname } from 'next/navigation'
import { ThemeToggle } from './theme-toggle'
import { UserMenu } from './topbar'

const labels: Record<string, string> = {
  '/': 'Dashboard',
  '/people': 'People',
  '/classes': 'Classes',
  '/billing': 'Billing'
};

export function Header() {
  const pathname = usePathname();
  const title = labels[pathname] ?? 'Dashboard';

  return (
    <header className="sticky top-4 z-40 flex items-center justify-between rounded-2xl border border-border bg-background/80 px-4 py-4 shadow-sm backdrop-blur md:px-6">
      <div className="flex items-center gap-4">
        {/* <MobileSidebar /> */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            EduFlow / {title}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {title}
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
