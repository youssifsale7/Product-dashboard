import { useQuery } from '@tanstack/react-query'

import { fetchProducts } from '@/lib/api'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
    retry: 1 // one automatic retry, then the user can retry manually
  })
}
