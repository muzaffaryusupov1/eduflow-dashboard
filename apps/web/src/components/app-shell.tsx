import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand-50 via-white to-sand-100 dark:from-ink-900 dark:via-ink-800 dark:to-ink-900">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-[260px_1fr] md:px-8 md:py-10">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar />
          <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-ink-800">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
