import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand-50">
      <div className="mx-auto flex min-h-screen max-w-6xl gap-6 px-6 py-8">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <Topbar />
          <div className="rounded-3xl border border-ink-900/10 bg-white p-6 shadow-card">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
