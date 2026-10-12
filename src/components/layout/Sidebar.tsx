'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { PackageIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { navLinks } from '@/configs/navConfig'

const SidebarLayout = () => {
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon' variant='sidebar'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='gap-2.5 bg-transparent!'
              render={<Link href='/dashboard' />}
            >
              <span className='bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-lg'>
                <PackageIcon className='size-5' />
              </span>
              <div className='flex flex-col items-start'>
                <span className='text-lg font-semibold text-nowrap'>Product Dashboard</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navLinks.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    tooltip={label}
                    render={<Link href={href} />}
                    isActive={pathname === href}
                    className='data-active:bg-sidebar-primary! data-active:text-sidebar-primary-foreground!'
                  >
                    <Icon />
                    <span className='min-w-0 flex-1 truncate'>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default SidebarLayout
