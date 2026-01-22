"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogoutIcon, UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useAuth } from '../auth-provider'

export function UserMenu() {
  const {logout} = useAuth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='py-5 border-none'>
        <Button variant="outline" className="gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>OY</AvatarFallback>
          </Avatar>
          <div className="text-left leading-tight">
            <p className="text-sm font-medium">Owner</p>
            <p className="text-xs text-muted-foreground">owner@eduflow.dev</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <HugeiconsIcon icon={UserIcon} size={16} />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <HugeiconsIcon icon={LogoutIcon} size={16} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
