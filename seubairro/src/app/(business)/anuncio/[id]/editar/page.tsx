'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { CategoryService } from '@/lib/api/services/CategoryService'
import { ListingService, type ListingResponse } from '@/lib/api/services/ListingService'
import { CategoryTypeEnum } from '@/lib/api/enums/CategoryTypeEnum'
import type { CategoryResponse } from '@/lib/api/dtos/Response/index'
import { ListingForm } from '@/features/business/components'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { PageHeader } from '@/design-system/patterns/PageHeader'

type ListingType = 'product' | 'service'

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; listing: ListingResponse; type: ListingType }

const normalize = <T,>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: unknown }).data))
    return (raw as { data: T[] }).data
  return []
}

export default function EditarAnuncioPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    if (!id) return
    let cancelled = false

    const load = async () => {
      try {
        // O anúncio não guarda "produto vs serviço": isso vem do tipo da sua
        // categoria, e o formulário precisa saber disso para filtrar as opções
        // e decidir se mostra o campo de estoque.
        const [listing, rawCategories] = await Promise.all([
          ListingService.getById(id),
          CategoryService.getAll(),
        ])
        if (cancelled) return

        const category = normalize<CategoryResponse>(rawCategories).find(
          (c) => c.id === listing.listingCategoryId,
        )
        const type: ListingType =
          category?.categoryType === CategoryTypeEnum.Servicos ? 'service' : 'product'

        setState({ kind: 'ready', listing, type })
      } catch (err) {
        if (cancelled) return
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Erro ao carregar o anúncio',
        })
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6">
      <PageHeader
        eyebrow={state.kind === 'ready' ? state.listing.title ?? undefined : undefined}
        title="Editar anúncio"
        description="Atualize as informações do seu anúncio. As mudanças aparecem no perfil público na hora."
      />

      {state.kind === 'loading' && (
        <div className="flex flex-col gap-6">
          <Skeleton variant="rect" height={280} />
          <Skeleton variant="rect" height={180} />
        </div>
      )}

      {state.kind === 'error' && (
        <ErrorState title="Não foi possível carregar o anúncio" description={state.message} />
      )}

      {state.kind === 'ready' && (
        <ListingForm
          type={state.type}
          listing={state.listing}
          onSaved={() => router.push(`/anuncio/${id}`)}
        />
      )}
    </div>
  )
}
