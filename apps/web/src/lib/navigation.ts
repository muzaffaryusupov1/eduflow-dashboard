import type { Role } from "@/lib/roles"
import {
  Calendar,
  CalendarCheckIn01Icon,
  CheckListIcon,
  CreditCard,
  LayoutDashboard,
  ImportantBookIcon,
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
  roles?: Role[]
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "People", href: "/people", icon: Users },
  { title: "Classes", href: "/classes", icon: Calendar },
  { title: "Attendance", href: "/attendance", icon: CheckListIcon, roles: ["TEACHER"] },
  {
    title: "Attendance History",
    href: "/attendance/history",
    icon: CalendarCheckIn01Icon,
    roles: ["OWNER", "ADMIN"],
  },
  { title: "Courses", href: "/courses", icon: ImportantBookIcon },
  { title: "Billing", href: "/billing", icon: CreditCard },
]
