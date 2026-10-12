import { LayoutDashboardIcon, PackageIcon } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavLink = {
  label: string
  href: string
  icon: LucideIcon
}

export const navLinks: NavLink[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboardIcon },
  { label: 'Products', href: '/products', icon: PackageIcon }
]
