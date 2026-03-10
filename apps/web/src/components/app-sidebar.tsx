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
    <Sidebar collapsible="offExamples" {...props}>
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
            <SidebarMenu>
              {visibleItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      className={cn(
                        'gap-3',
                        active && 'bg-sidebar-accent text-sidebar-accent-foreground',
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-2">
                        <HugeiconsIcon icon={item.icon} size={18} />
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
