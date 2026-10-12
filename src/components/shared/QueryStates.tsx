import { RotateCwIcon, TriangleAlertIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => {
  return (
    <div
      className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      role='status'
      aria-label='Loading products'
    >
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} size='sm' className='gap-0 py-0'>
          <Skeleton className='aspect-square w-full rounded-none' />
          <CardContent className='space-y-2 py-4'>
            <Skeleton className='h-3 w-1/3' />
            <Skeleton className='h-4 w-4/5' />
            <Skeleton className='h-5 w-1/4' />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

type ErrorStateProps = {
  message: string
  onRetry: () => void
  retrying: boolean
}

export const ErrorState = ({ message, onRetry, retrying }: ErrorStateProps) => {
  return (
    <Card className='mx-auto max-w-md' role='alert'>
      <CardContent className='flex flex-col items-center gap-3 text-center'>
        <span className='bg-destructive/10 text-destructive flex size-10 items-center justify-center rounded-full'>
          <TriangleAlertIcon className='size-5' />
        </span>
        <h2 className='text-lg font-semibold'>Products didn&apos;t load</h2>
        <p className='text-muted-foreground'>{message} Check your connection and try again.</p>
        <Button onClick={onRetry} disabled={retrying}>
          <RotateCwIcon className={retrying ? 'animate-spin' : undefined} />
          {retrying ? 'Retrying…' : 'Retry'}
        </Button>
      </CardContent>
    </Card>
  )
}

type EmptyStateProps = {
  message: string
  actionLabel?: string
  onAction?: () => void
}

export const EmptyState = ({ message, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className='flex flex-col items-center gap-3 rounded-xl border border-dashed p-10 text-center'>
      <p className='text-muted-foreground'>{message}</p>
      {actionLabel && onAction && (
        <Button variant='outline' onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
