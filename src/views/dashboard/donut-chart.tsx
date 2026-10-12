'use client'

import { useMemo } from 'react'

import { Label, Pie, PieChart } from 'recharts'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import type { ChartConfig } from '@/components/ui/chart'

export type DonutDatum = {
  key: string
  label: string
  value: number
  color: string
}

type DonutChartProps = {
  data: DonutDatum[]
  centerValue: string
  centerLabel: string
}

const DonutChart = ({ data, centerValue, centerLabel }: DonutChartProps) => {
  const config = useMemo(() => {
    const result: ChartConfig = { value: { label: 'Products' } }

    data.forEach(d => {
      result[d.key] = { label: d.label, color: d.color }
    })

    return result
  }, [data])

  const chartData = useMemo(
    () => data.map(d => ({ key: d.key, value: d.value, fill: `var(--color-${d.key})` })),
    [data]
  )

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className='flex flex-col gap-4'>
      <ChartContainer config={config} className='mx-auto h-52 w-full'>
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={chartData} dataKey='value' nameKey='key' innerRadius={60} outerRadius={85} paddingAngle={2}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 8} className='fill-card-foreground text-2xl font-semibold'>
                        {centerValue}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className='fill-muted-foreground text-sm'>
                        {centerLabel}
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <ul className='grid gap-2 text-sm'>
        {data.map(d => (
          <li key={d.key} className='flex items-center justify-between gap-3'>
            <span className='flex items-center gap-2'>
              <span className='size-2.5 rounded-full' style={{ backgroundColor: d.color }} />
              {d.label}
            </span>
            <span className='text-muted-foreground'>
              {d.value} ({total ? Math.round((d.value / total) * 100) : 0}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default DonutChart
