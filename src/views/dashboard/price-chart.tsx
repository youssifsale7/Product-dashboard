'use client'

import { useMemo } from 'react'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import { formatCategory } from '@/lib/api'
import type { Product } from '@/lib/types'

const chartConfig = {
  average: {
    label: 'Average price ($)',
    color: 'var(--chart-2)'
  }
} satisfies ChartConfig

const PriceChart = ({ products }: { products: Product[] }) => {
  const chartData = useMemo(() => {
    const groups = new Map<string, { total: number; count: number }>()

    products.forEach(p => {
      const group = groups.get(p.category) ?? { total: 0, count: 0 }

      group.total += p.price
      group.count += 1
      groups.set(p.category, group)
    })

    return Array.from(groups, ([category, { total, count }]) => ({
      category: formatCategory(category),
      average: Math.round((total / count) * 100) / 100
    }))
      .sort((a, b) => b.average - a.average)
      .slice(0, 8)
  }, [products])

  return (
    <ChartContainer config={chartConfig} className='h-72 w-full'>
      <BarChart accessibilityLayer data={chartData} layout='vertical' margin={{ left: 0, right: 8 }}>
        <CartesianGrid horizontal={false} />
        <YAxis dataKey='category' type='category' tickLine={false} axisLine={false} width={120} />
        <XAxis type='number' hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey='average' fill='var(--color-average)' radius={4} />
      </BarChart>
    </ChartContainer>
  )
}

export default PriceChart
