'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ListingFilters } from '@/features/client/components/ListingFilters'
import { Button } from '@/design-system/primitives/Button'
import {
  parseSearchParams,
  serializeFilters,
  listingSearchSchema,
  type ListingSearchFilters,
} from '@/features/client/schemas/listing-search.schema'

export default function FiltrosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initial = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  )
  const [filters, setFilters] = useState<ListingSearchFilters>(initial)

  const clear = () => setFilters(listingSearchSchema.parse({}))

  const apply = () => {
    const qs = serializeFilters(filters).toString()
    router.push(qs ? `/dashboard-client?${qs}` : '/dashboard-client')
  }

  return (
    <div
      className="flex flex-col gap-6 max-w-3xl mx-auto w-full"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 6rem)' }}
    >
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">Filtros</h1>
        <p className="text-[var(--color-muted)] mt-1">Refine o que aparece no seu feed.</p>
      </header>

      <ListingFilters filters={filters} onChange={setFilters} />

      <div
        className="fixed bottom-0 left-0 right-0 md:static md:mt-4 bg-[var(--color-surface)] md:bg-transparent border-t md:border-0 border-[var(--color-border-default)] p-4 md:p-0 flex gap-3 z-30"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
      >
        <Button variant="outline" fullWidth onClick={clear}>
          Limpar
        </Button>
        <Button fullWidth onClick={apply}>
          Aplicar Filtros
        </Button>
      </div>
    </div>
  )
}
