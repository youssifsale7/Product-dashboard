'use client'

import { useMemo } from 'react'
import type { ReactNode } from 'react'

import Link from 'next/link'

import {
  BadgeDollarSignIcon,
  BoxesIcon,
  CoinsIcon,
  HeartIcon,
  LayersIcon,
  PackageIcon,
  StarIcon,
  TagIcon
} from 'lucide-react'

import { ErrorState } from '@/components/shared/QueryStates'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useProducts } from '@/hooks/use-products'
import { formatCategory, formatCompactPrice, formatPrice } from '@/lib/api'
import type { Product } from '@/lib/types'
import { useFavourites } from '@/store/favourites'

import CategoryChart from '@/views/dashboard/category-chart'
import DonutChart from '@/views/dashboard/donut-chart'
import type { DonutDatum } from '@/views/dashboard/donut-chart'
import PriceChart from '@/views/dashboard/price-chart'
import RatingChart from '@/views/dashboard/rating-chart'

const LOW_STOCK_LIMIT = 10

type StatCardProps = {
  icon: ReactNode
  title: string
  value: string
  hint: string
  loading: boolean
}

const StatCard = ({ icon, title, value, hint, loading }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className='flex items-center gap-3'>
        <div className='bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg'>
          {icon}
        </div>
        <CardTitle className='text-muted-foreground font-medium'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-1'>
        {loading ? <Skeleton className='h-8 w-24' /> : <span className='text-3xl font-semibold'>{value}</span>}
        <span className='text-muted-foreground text-sm'>{hint}</span>
      </CardContent>
    </Card>
  )
}

type ProductRowProps = {
  product: Product
  value: string
  sub: string
}

const ProductRow = ({ product, value, sub }: ProductRowProps) => {
  return (
    <div className='flex items-center gap-3'>
      <img src={product.thumbnail} alt='' loading='lazy' className='bg-muted size-12 shrink-0 rounded-md object-contain' />
      <div className='min-w-0 flex-1'>
        <p className='truncate font-medium'>{product.title}</p>
        <p className='text-muted-foreground truncate text-sm'>{formatCategory(product.category)}</p>
      </div>
      <div className='text-right'>
        <p className='font-medium'>{value}</p>
        <p className='text-muted-foreground text-sm'>{sub}</p>
      </div>
    </div>
  )
}

type ListCardProps = {
  title: string
  description: string
  loading: boolean
  emptyMessage: string
  className?: string
  action?: ReactNode
  children: ReactNode[]
}

const ListCard = ({ title, description, loading, emptyMessage, className, action, children }: ListCardProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className='h-12 w-full' />)
        ) : children.length > 0 ? (
          children
        ) : (
          <p className='text-muted-foreground text-sm'>{emptyMessage}</p>
        )}
      </CardContent>
    </Card>
  )
}

const DashboardOverview = () => {
  const { data, isPending, isError, error, refetch, isFetching } = useProducts()
  const favouriteIds = useFavourites(state => state.ids)

  const stats = useMemo(() => {
    const products = data ?? []
    const count = products.length
    const sum = (fn: (p: Product) => number) => products.reduce((total, p) => total + fn(p), 0)

    const priceBuckets: DonutDatum[] = [
      { key: 'under25', label: 'Under $25', value: 0, color: 'var(--chart-1)' },
      { key: 'mid', label: '$25 – $99', value: 0, color: 'var(--chart-2)' },
      { key: 'high', label: '$100 – $499', value: 0, color: 'var(--chart-3)' },
      { key: 'premium', label: '$500 and up', value: 0, color: 'var(--chart-4)' }
    ]

    const stockStatus: DonutDatum[] = [
      { key: 'inStock', label: 'In stock', value: 0, color: 'var(--chart-1)' },
      { key: 'lowStock', label: `Low stock (${LOW_STOCK_LIMIT} or fewer)`, value: 0, color: 'var(--chart-5)' },
      { key: 'outOfStock', label: 'Out of stock', value: 0, color: 'var(--destructive)' }
    ]

    products.forEach(p => {
      const bucket = p.price < 25 ? 0 : p.price < 100 ? 1 : p.price < 500 ? 2 : 3

      priceBuckets[bucket].value += 1

      const status = p.stock === 0 ? 2 : p.stock <= LOW_STOCK_LIMIT ? 1 : 0

      stockStatus[status].value += 1
    })

    return {
      count,
      categoryCount: new Set(products.map(p => p.category)).size,
      brandCount: new Set(products.map(p => p.brand).filter(Boolean)).size,
      averageRating: count ? sum(p => p.rating) / count : 0,
      averagePrice: count ? sum(p => p.price) / count : 0,
      totalUnits: sum(p => p.stock),
      inventoryValue: sum(p => p.price * p.stock),
      priceBuckets,
      stockStatus,
      topRated: [...products].sort((a, b) => b.rating - a.rating).slice(0, 5),
      lowStock: products
        .filter(p => p.stock > 0 && p.stock <= LOW_STOCK_LIMIT)
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 5)
    }
  }, [data])

  const favourites = useMemo(
    () => (data ?? []).filter(p => favouriteIds.includes(p.id)).slice(0, 5),
    [data, favouriteIds]
  )

  return (
    <div className='flex flex-col gap-6'>
      <div>
        <h1 className='text-2xl font-semibold'>Dashboard</h1>
        <p className='text-muted-foreground'>A quick look at your product catalogue.</p>
      </div>

      {isError ? (
        <ErrorState
          message={error instanceof Error ? error.message : 'Something went wrong.'}
          onRetry={() => void refetch()}
          retrying={isFetching}
        />
      ) : (
        <>
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            <StatCard
              icon={<PackageIcon className='size-5' />}
              title='Products'
              value={String(stats.count)}
              hint='In the catalogue'
              loading={isPending}
            />
            <StatCard
              icon={<LayersIcon className='size-5' />}
              title='Categories'
              value={String(stats.categoryCount)}
              hint='Product groups'
              loading={isPending}
            />
            <StatCard
              icon={<TagIcon className='size-5' />}
              title='Brands'
              value={String(stats.brandCount)}
              hint='Distinct brands'
              loading={isPending}
            />
            <StatCard
              icon={<HeartIcon className='size-5' />}
              title='Favourites'
              value={String(favouriteIds.length)}
              hint='Saved on this device'
              loading={false}
            />
            <StatCard
              icon={<BadgeDollarSignIcon className='size-5' />}
              title='Average price'
              value={formatPrice(stats.averagePrice)}
              hint='Across all products'
              loading={isPending}
            />
            <StatCard
              icon={<StarIcon className='size-5' />}
              title='Average rating'
              value={stats.averageRating.toFixed(2)}
              hint='Out of 5'
              loading={isPending}
            />
            <StatCard
              icon={<BoxesIcon className='size-5' />}
              title='Units in stock'
              value={stats.totalUnits.toLocaleString('en-US')}
              hint='Total across products'
              loading={isPending}
            />
            <StatCard
              icon={<CoinsIcon className='size-5' />}
              title='Inventory value'
              value={formatCompactPrice(stats.inventoryValue)}
              hint='Price × units in stock'
              loading={isPending}
            />
          </div>

          <div className='grid gap-4 lg:grid-cols-5'>
            <Card className='lg:col-span-3'>
              <CardHeader>
                <CardTitle>Products per category</CardTitle>
                <CardDescription>The 8 largest categories</CardDescription>
              </CardHeader>
              <CardContent>
                {isPending ? <Skeleton className='h-72 w-full' /> : <CategoryChart products={data ?? []} />}
              </CardContent>
            </Card>

            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Price ranges</CardTitle>
                <CardDescription>How products are spread by price</CardDescription>
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <Skeleton className='h-72 w-full' />
                ) : (
                  <DonutChart data={stats.priceBuckets} centerValue={String(stats.count)} centerLabel='Products' />
                )}
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 lg:grid-cols-5'>
            <Card className='lg:col-span-3'>
              <CardHeader>
                <CardTitle>Average price by category</CardTitle>
                <CardDescription>The 8 most expensive categories</CardDescription>
              </CardHeader>
              <CardContent>
                {isPending ? <Skeleton className='h-72 w-full' /> : <PriceChart products={data ?? []} />}
              </CardContent>
            </Card>

            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Rating distribution</CardTitle>
                <CardDescription>How customers rate the catalogue</CardDescription>
              </CardHeader>
              <CardContent>
                {isPending ? <Skeleton className='h-72 w-full' /> : <RatingChart products={data ?? []} />}
              </CardContent>
            </Card>
          </div>

          <div className='grid gap-4 lg:grid-cols-5'>
            <Card className='lg:col-span-2'>
              <CardHeader>
                <CardTitle>Stock status</CardTitle>
                <CardDescription>Availability of the catalogue</CardDescription>
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <Skeleton className='h-72 w-full' />
                ) : (
                  <DonutChart data={stats.stockStatus} centerValue={String(stats.count)} centerLabel='Products' />
                )}
              </CardContent>
            </Card>

            <ListCard
              className='lg:col-span-3'
              title='Top rated'
              description='Highest rated products'
              loading={isPending}
              emptyMessage='No products to show.'
              action={
                <Button variant='outline' size='sm' render={<Link href='/products' />} nativeButton={false}>
                  View all
                </Button>
              }
            >
              {stats.topRated.map(p => (
                <ProductRow key={p.id} product={p} value={formatPrice(p.price)} sub={`${p.rating.toFixed(1)} / 5`} />
              ))}
            </ListCard>
          </div>

          <div className='grid gap-4 lg:grid-cols-2'>
            <ListCard
              title='Low stock'
              description={`Products with ${LOW_STOCK_LIMIT} or fewer units left`}
              loading={isPending}
              emptyMessage='No products are running low.'
            >
              {stats.lowStock.map(p => (
                <ProductRow key={p.id} product={p} value={`${p.stock} left`} sub={formatPrice(p.price)} />
              ))}
            </ListCard>

            <ListCard
              title='Your favourites'
              description='Products you saved'
              loading={isPending}
              emptyMessage='Nothing saved yet. Select the heart on a product to add it here.'
              action={
                <Button variant='outline' size='sm' render={<Link href='/products' />} nativeButton={false}>
                  Browse products
                </Button>
              }
            >
              {favourites.map(p => (
                <ProductRow key={p.id} product={p} value={formatPrice(p.price)} sub={`${p.rating.toFixed(1)} / 5`} />
              ))}
            </ListCard>
          </div>
        </>
      )}
    </div>
  )
}

export default DashboardOverview
