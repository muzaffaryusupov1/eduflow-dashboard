import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  Users,
} from "@hugeicons/core-free-icons"

export type IconEntry = {
  title: string
  icon: typeof LayoutDashboard
}

export type NavItem = {
  title: string
  href: string
  icon: typeof LayoutDashboard
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "People", href: "/people", icon: Users },
  { title: "Classes", href: "/classes", icon: Calendar },
  { title: "Billing", href: "/billing", icon: CreditCard },
]
