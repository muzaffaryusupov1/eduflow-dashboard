import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggleButton } from '../ui/skiper-ui/skiper26'
import { UserMenu } from './user-menu'

export function Header() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 bg-background/80 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        {/* <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        /> */}
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggleButton blur variant='rectangle' start='bottom-up' />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
