import { AppSidebar } from '../app-sidebar'
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar'
import { Header } from "./header"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar/>
        <main className="flex min-h-screen flex-1 flex-col">
          <Header />
          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-0 py-6 md:px-6">
            <SidebarTrigger/>
            {children}
          </div>
        </main>
    </SidebarProvider>

  )
}
