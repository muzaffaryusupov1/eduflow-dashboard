"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { TooltipProvider } from "@/components/ui/tooltip"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { UserMenu } from "./user-menu"
// import { MobileNavSheet } from "./mobile-nav-sheet"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/people": "People",
  "/classes": "Classes",
  "/billing": "Billing",
}

export function Header() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? "Dashboard"

  return (
    <TooltipProvider>
      <header className="sticky top-6 z-40 flex items-center justify-between rounded-xl border border-border bg-background/80 px-4 py-4 shadow-sm backdrop-blur md:px-6">
        <div className="flex items-center gap-4">
          {/* <MobileNavSheet /> */}
          <div className="space-y-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">EduFlow</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>
    </TooltipProvider>
  )
}
