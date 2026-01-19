"use client"

import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
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
import { Badge } from "@/components/ui/badge"
import { navItems } from "@/lib/navigation"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="space-y-1">
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
                      <a href={item.href} className="flex items-center gap-2">
                        <HugeiconsIcon icon={item.icon} size={18} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Signed in
        </p>
        <p className="text-sm font-medium">owner@eduflow.dev</p>
        <Badge variant="secondary" className="w-fit">
          OWNER
        </Badge>
      </SidebarFooter>
    </Sidebar>
  )
}
