import { Sidebar } from './sidebar';
import { Header } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex min-h-screen max-w-[1440px] gap-6 px-4 py-6 md:px-8">
        <Sidebar />
        <main className="flex min-h-screen flex-1 flex-col">
          <Header />
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-0 py-6 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
