import { AppSidebar } from '../app-sidebar'
import { SidebarInset, SidebarProvider } from '../ui/sidebar'
import { Header } from "./header"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider style={{
      "--sidebar-width": "calc(var(--spacing) * 72)",
      "--header-height": "calc(var(--spacing) * 12)",
    } as React.CSSProperties}>
      <AppSidebar variant='inset' collapsible='icon' />
      <SidebarInset>
        <Header />
        <div className='flex flex-1 flex-col'>
          <div className="@container/main flex flex-1 flex-col gap-2">
            <main className="flex min-h-screen flex-1 flex-col bg-background">
              <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-0 py-8 md:px-8">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>

  )
}
