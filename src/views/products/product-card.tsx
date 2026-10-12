'use client'

import { memo } from 'react'

import { HeartIcon, StarIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCategory, formatPrice } from '@/lib/api'
import type { Product } from '@/lib/types'
import { cn } from '@/lib/utils'

type ProductCardProps = {
  product: Product
  isFavourite: boolean
  onToggle: (id: number) => void
}

const ProductCard = memo(({ product, isFavourite, onToggle }: ProductCardProps) => {
  return (
    <Card size='sm' className='gap-0 py-0'>
      <div className='bg-muted relative aspect-square'>
        <img src={product.thumbnail} alt={product.title} loading='lazy' className='size-full object-contain' />
        <Button
          variant='secondary'
          size='icon'
          className='absolute top-3 right-3 rounded-full shadow-sm'
          aria-pressed={isFavourite}
          aria-label={isFavourite ? `Remove ${product.title} from favourites` : `Add ${product.title} to favourites`}
          onClick={() => onToggle(product.id)}
        >
          <HeartIcon className={cn('size-5', isFavourite && 'fill-current text-rose-500')} />
        </Button>
      </div>
      <CardContent className='flex flex-1 flex-col gap-2 py-4'>
        <Badge variant='secondary' className='w-fit'>
          {formatCategory(product.category)}
        </Badge>
        <h3 className='line-clamp-2 leading-snug font-medium'>{product.title}</h3>
        <div className='mt-auto flex items-center justify-between pt-2'>
          <span className='text-lg font-semibold'>{formatPrice(product.price)}</span>
          <span className='text-muted-foreground flex items-center gap-1 text-sm'>
            <StarIcon className='size-4 fill-amber-400 text-amber-400' />
            {product.rating.toFixed(1)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
})

export default ProductCard
