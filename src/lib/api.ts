import type { Product } from '@/lib/types'

const API_URL = 'https://dummyjson.com/products'
const FIELDS = 'id,title,description,category,price,rating,stock,brand,thumbnail'

export async function fetchProducts(): Promise<Product[]> {
  // limit=0 returns every product in one request, so search and category
  // filtering can run instantly on the client without extra network calls.
  const res = await fetch(`${API_URL}?limit=0&select=${FIELDS}`)

  if (!res.ok) {
    throw new Error(`The server responded with status ${res.status}.`)
  }

  const data = (await res.json()) as { products: Product[] }

  return data.products
}

export function formatCategory(slug: string): string {
  const text = slug.replace(/-/g, ' ')

  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function formatCompactPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}
