"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { navItems } from "@/lib/navigation"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from 'next/link'
import { usePathname } from "next/navigation"
import { NavUser } from './app-shell/nav-user'

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible='offExamples' {...props}>
      <SidebarHeader className="space-y-1 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          EduFlow
        </p>
        <p className="text-lg font-semibold tracking-tight">Control Center</p>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = pathname === item.href
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        "gap-3",
                        active && "bg-sidebar-accent text-sidebar-accent-foreground"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-2">
                        <HugeiconsIcon icon={item.icon} size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser user={{avatar: '', email: '@yusupoovdev@gmail.com', name: 'Muzaffar'}} />
      </SidebarFooter>
    </Sidebar>
  )
}
