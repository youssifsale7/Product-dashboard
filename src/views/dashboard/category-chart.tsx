'use client'

import { useMemo } from 'react'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { formatCategory } from '@/lib/api'
import type { Product } from '@/lib/types'

const chartConfig = {
  count: {
    label: 'Products',
    color: 'var(--primary)'
  }
} satisfies ChartConfig

const CategoryChart = ({ products }: { products: Product[] }) => {
  const chartData = useMemo(() => {
    const counts = new Map<string, number>()

    products.forEach(p => counts.set(p.category, (counts.get(p.category) ?? 0) + 1))

    return Array.from(counts, ([category, count]) => ({ category: formatCategory(category), count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
  }, [products])

  return (
    <ChartContainer config={chartConfig} className='h-72 w-full'>
      <BarChart accessibilityLayer data={chartData} layout='vertical' margin={{ left: 0, right: 8 }}>
        <CartesianGrid horizontal={false} />
        <YAxis dataKey='category' type='category' tickLine={false} axisLine={false} width={120} />
        <XAxis type='number' hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey='count' fill='var(--color-count)' radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export default CategoryChart
