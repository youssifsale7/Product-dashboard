'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ThemeProvider } from '@/components/ThemeProvider'
import { SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useFavourites } from '@/store/favourites'

const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())

  useEffect(() => {
    void useFavourites.persist.rehydrate()
  }, [])

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default Providers
