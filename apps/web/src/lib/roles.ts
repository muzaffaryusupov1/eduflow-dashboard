export type Role = 'OWNER' | 'ADMIN' | 'TEACHER';

type NavItem = {
  label: string;
  href: string;
  roles?: Role[];
  badge?: string;
};

export const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/' },
  { label: 'People', href: '/people', roles: ['OWNER', 'ADMIN'] },
  { label: 'Classes', href: '/classes', roles: ['OWNER', 'ADMIN', 'TEACHER'] },
  { label: 'Billing', href: '/billing', roles: ['OWNER'] }
];
