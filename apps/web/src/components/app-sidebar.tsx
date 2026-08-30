'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { navItems } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavUser } from './app-shell/nav-user';
import { useAuth } from './auth-provider';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role;
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const visibleItems = navItems.filter(
    (item) => !item.roles || (role ? item.roles.includes(role) : false),
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <Link href={'/'}>
        <SidebarHeader
          className={cn('space-y-1 p-5 flex flex-row items-center gap-2', isCollapsed && 'p-2')}
        >
          <div className="relative w-10 h-10">
            <Image src={'/site-logo.png'} alt="site logo" fill className="object-contain" />
          </div>
          {!isCollapsed && (
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">EduFlow</p>
          )}
        </SidebarHeader>
      </Link>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {visibleItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        'gap-3 relative h-10 rounded-md',
                        active &&
                        'bg-transparent hover:bg-transparent data-[active=true]:bg-transparent text-foreground before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-5 before:w-[2px] before:rounded-full before:bg-linear-to-b before:from-[#2563eb] before:to-[#06b6d4]',
                        !active && 'text-muted-foreground',
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={item.icon}
                          size={18}
                          className={cn(active ? 'text-[#4cd7f6]' : 'text-[#4cd7f6]/60')}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser user={{ avatar: '', email: '@yusupoovdev@gmail.com', name: 'Muzaffar' }} />
      </SidebarFooter>
    </Sidebar>
  );
}
