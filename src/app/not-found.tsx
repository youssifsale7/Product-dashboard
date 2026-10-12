import Link from 'next/link'

import { Button } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center gap-4 p-6 text-center'>
      <h1 className='text-5xl font-semibold'>404</h1>
      <p className='text-muted-foreground'>We couldn&apos;t find the page you are looking for.</p>
      <Button render={<Link href='/dashboard' />} nativeButton={false}>
        Back to dashboard
      </Button>
    </div>
  )
}

export default NotFound
