"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { navItems } from "@/lib/navigation"

export function SidebarNav({
  className,
  mobile = false,
}: {
  className?: string
  mobile?: boolean
}) {
  const pathname = usePathname()

  return (
    <Card
      className={cn(
        "h-full flex-col",
        mobile
          ? "flex w-full rounded-none border-none shadow-none"
          : "sticky top-6 hidden h-[calc(100vh-3rem)] w-[270px] md:flex",
        className
      )}
    >
      <div className="flex h-full flex-col gap-6 p-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            EduFlow
          </p>
          <p className="mt-2 text-lg font-semibold tracking-tight">
            Control Center
          </p>
        </div>
        <Separator />
        <ScrollArea className="flex-1">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <HugeiconsIcon icon={item.icon} size={18} />
                    {item.title}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </ScrollArea>
        <Separator />
        <div className="space-y-2 text-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Signed in
          </p>
          <p className="font-medium">owner@eduflow.dev</p>
          <Badge variant="secondary" className="w-fit">
            OWNER
          </Badge>
        </div>
      </div>
    </Card>
  )
}
