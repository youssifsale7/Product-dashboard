'use client'

import { useMemo, useState } from 'react'

import { HeartIcon, SearchIcon } from 'lucide-react'

import { EmptyState, ErrorState, ProductGridSkeleton } from '@/components/shared/QueryStates'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { useProducts } from '@/hooks/use-products'
import { formatCategory } from '@/lib/api'
import { useFavourites } from '@/store/favourites'

import ProductCard from '@/views/products/product-card'

const PAGE_SIZE = 24

const ProductsView = () => {
  const { data, isPending, isError, error, refetch, isFetching } = useProducts()
  const favouriteIds = useFavourites(state => state.ids)
  const toggleFavourite = useFavourites(state => state.toggle)

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)
  const [favouritesOnly, setFavouritesOnly] = useState(false)
  const [limit, setLimit] = useState(PAGE_SIZE)

  const debouncedQuery = useDebounce(query.trim().toLowerCase())
  const favouriteSet = useMemo(() => new Set(favouriteIds), [favouriteIds])

  const categories = useMemo(() => Array.from(new Set((data ?? []).map(p => p.category))).sort(), [data])

  const filtered = useMemo(() => {
    return (data ?? []).filter(p => {
      if (category && p.category !== category) return false
      if (favouritesOnly && !favouriteSet.has(p.id)) return false
      if (!debouncedQuery) return true

      return `${p.title} ${p.brand ?? ''} ${p.category.replace(/-/g, ' ')}`.toLowerCase().includes(debouncedQuery)
    })
  }, [data, category, favouritesOnly, favouriteSet, debouncedQuery])

  const visible = filtered.slice(0, limit)
  const hasFilters = Boolean(query || category || favouritesOnly)

  const resetFilters = () => {
    setQuery('')
    setCategory(null)
    setFavouritesOnly(false)
    setLimit(PAGE_SIZE)
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold'>Products</h1>
          <p className='text-muted-foreground'>Search, filter and save the products you like.</p>
        </div>
        <Button
          variant={favouritesOnly ? 'default' : 'outline'}
          aria-pressed={favouritesOnly}
          onClick={() => {
            setFavouritesOnly(v => !v)
            setLimit(PAGE_SIZE)
          }}
        >
          <HeartIcon className={favouriteIds.length > 0 ? 'fill-current' : undefined} />
          Favourites
          <Badge variant={favouritesOnly ? 'secondary' : 'default'} aria-live='polite'>
            {favouriteIds.length}
          </Badge>
        </Button>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='relative'>
          <SearchIcon className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            type='search'
            aria-label='Search products'
            placeholder='Search by name, brand or category'
            className='h-10 pl-9'
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setLimit(PAGE_SIZE)
            }}
          />
        </div>

        {categories.length > 0 && (
          <div role='group' aria-label='Filter by category' className='flex gap-2 overflow-x-auto pb-1 sm:flex-wrap'>
            <Button
              size='sm'
              variant={category === null ? 'default' : 'outline'}
              aria-pressed={category === null}
              onClick={() => {
                setCategory(null)
                setLimit(PAGE_SIZE)
              }}
            >
              All
            </Button>
            {categories.map(c => (
              <Button
                key={c}
                size='sm'
                variant={category === c ? 'default' : 'outline'}
                aria-pressed={category === c}
                onClick={() => {
                  setCategory(category === c ? null : c)
                  setLimit(PAGE_SIZE)
                }}
              >
                {formatCategory(c)}
              </Button>
            ))}
          </div>
        )}
      </div>

      {isPending && <ProductGridSkeleton />}

      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : 'Something went wrong.'}
          onRetry={() => void refetch()}
          retrying={isFetching}
        />
      )}

      {data && (
        <>
          <p className='text-muted-foreground text-sm' aria-live='polite'>
            {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            {hasFilters && (
              <Button variant='link' size='sm' onClick={resetFilters}>
                Clear filters
              </Button>
            )}
          </p>

          {filtered.length === 0 ? (
            <EmptyState
              message={
                favouritesOnly && favouriteIds.length === 0
                  ? "You haven't added any favourites yet. Select the heart on a product to save it."
                  : 'No products match your search.'
              }
              actionLabel={hasFilters ? 'Clear filters' : undefined}
              onAction={hasFilters ? resetFilters : undefined}
            />
          ) : (
            <>
              <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {visible.map(p => (
                  <ProductCard key={p.id} product={p} isFavourite={favouriteSet.has(p.id)} onToggle={toggleFavourite} />
                ))}
              </div>
              {filtered.length > visible.length && (
                <div className='flex justify-center'>
                  <Button variant='outline' onClick={() => setLimit(l => l + PAGE_SIZE)}>
                    Show more ({filtered.length - visible.length} left)
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default ProductsView
