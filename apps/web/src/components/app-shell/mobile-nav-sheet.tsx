"use client"

import { Menu01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "./sidebar-nav"

export function MobileNavSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <HugeiconsIcon icon={Menu01Icon} size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SidebarNav mobile />
      </SheetContent>
    </Sheet>
  )
}
