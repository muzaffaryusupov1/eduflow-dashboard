"use client"

import { useTheme } from "next-themes"
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          <HugeiconsIcon icon={isDark ? Sun01Icon : Moon01Icon} size={18} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isDark ? "Switch to light" : "Switch to dark"}</p>
      </TooltipContent>
    </Tooltip>
  )
}
