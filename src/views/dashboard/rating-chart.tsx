'use client'

import { useMemo } from 'react'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'
import type { Product } from '@/lib/types'

const chartConfig = {
  count: {
    label: 'Products',
    color: 'var(--chart-3)'
  }
} satisfies ChartConfig

const RatingChart = ({ products }: { products: Product[] }) => {
  const chartData = useMemo(() => {
    const buckets = [
      { range: 'Under 3', count: 0 },
      { range: '3 – 3.9', count: 0 },
      { range: '4 – 4.4', count: 0 },
      { range: '4.5+', count: 0 }
    ]

    products.forEach(p => {
      const index = p.rating < 3 ? 0 : p.rating < 4 ? 1 : p.rating < 4.5 ? 2 : 3

      buckets[index].count += 1
    })

    return buckets
  }, [products])

  return (
    <ChartContainer config={chartConfig} className='h-72 w-full'>
      <BarChart accessibilityLayer data={chartData} margin={{ left: 0, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='range' tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey='count' fill='var(--color-count)' radius={6} />
      </BarChart>
    </ChartContainer>
  )
}

export default RatingChart
