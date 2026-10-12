import type { ReactNode } from 'react'

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import Providers from '@/components/Providers'
import ScrollToTop from '@/components/layout/ScrollToTop'
import { cn } from '@/lib/utils'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Product Dashboard',
  description: 'Browse, search, filter and favourite products. Built with Next.js, React Query and Zustand.'
}

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang='en' className={cn(geistSans.variable, 'flex min-h-full w-full antialiased')} suppressHydrationWarning>
      <body className='flex min-h-full w-full flex-auto flex-col'>
        <Providers>{children}</Providers>
        <ScrollToTop />
      </body>
    </html>
  )
}

export default RootLayout
