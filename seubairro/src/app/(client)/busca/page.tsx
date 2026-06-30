'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { SearchBar } from '@/design-system/patterns/SearchBar'
import { GeolocationGate } from '@/features/client/components/GeolocationGate'
import { ListingFeed } from '@/features/client/components/ListingFeed'
import { parseSearchParams, serializeFilters } from '@/features/client/schemas/listing-search.schema'

export default function BuscaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const filters = useMemo(
    () => parseSearchParams(new URLSearchParams(searchParams.toString())),
    [searchParams],
  )
  const [text, setText] = useState(filters.query ?? '')

  const pushQuery = (value: string) => {
    const qs = serializeFilters({ ...filters, query: value || undefined }).toString()
    router.replace(qs ? `/busca?${qs}` : '/busca')
  }

  // Debounce de 300ms antes de refletir na URL (e, por consequência, no feed).
  useEffect(() => {
    const handle = setTimeout(() => pushQuery(text), 300)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="sr-only">Buscar anúncios</h1>
      <div className="sticky top-[var(--nav-height)] z-20 bg-[var(--color-page)] -mx-4 md:-mx-6 px-4 md:px-6 py-3">
        <SearchBar
          autoFocus
          value={text}
          onChange={setText}
          onSubmit={pushQuery}
          placeholder="Busque por bolo de pote, corte de cabelo..."
        />
      </div>

      <GeolocationGate>
        <ListingFeed filters={filters} />
      </GeolocationGate>
    </div>
  )
}
