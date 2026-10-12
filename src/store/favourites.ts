import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavouritesState = {
  ids: number[]
  toggle: (id: number) => void
  clear: () => void
}

export const useFavourites = create<FavouritesState>()(
  persist(
    set => ({
      ids: [],
      toggle: id =>
        set(state => ({
          ids: state.ids.includes(id) ? state.ids.filter(x => x !== id) : [...state.ids, id]
        })),
      clear: () => set({ ids: [] })
    }),
    {
      name: 'product-dashboard:favourites',
      // Rehydrated manually after mount (see Providers) so the server render
      // and the first client render match and no hydration mismatch occurs.
      skipHydration: true
    }
  )
)
