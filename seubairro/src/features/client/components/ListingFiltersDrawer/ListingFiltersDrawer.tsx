'use client'

import { useState } from 'react'
import { Drawer } from '@/design-system/patterns/Drawer'
import { Button } from '@/design-system/primitives/Button'
import { ListingFilters } from '@/features/client/components/ListingFilters'
import {
  listingSearchSchema,
  type ListingSearchFilters,
} from '@/features/client/schemas/listing-search.schema'
import { cn } from '@/lib/utils/cn'

type Props = {
  /** Filtros atualmente aplicados (fonte de verdade externa, ex.: URL). */
  filters: ListingSearchFilters
  /** Commit dos filtros ao clicar em "Aplicar filtros". */
  onApply: (filters: ListingSearchFilters) => void
  /** Nº de filtros ativos — exibido como badge no botão. */
  activeCount?: number
  /** Classe extra para o botão que abre o drawer. */
  triggerClassName?: string
}

/**
 * Abre os filtros do feed num slide-over lateral. As alterações ficam em um
 * rascunho local e só são commitadas (via `onApply`) ao clicar em "Aplicar
 * filtros" — "Limpar filtros" apenas reseta o rascunho, sem fechar o painel.
 */
export function ListingFiltersDrawer({ filters, onApply, activeCount = 0, triggerClassName }: Props) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<ListingSearchFilters>(filters)

  // Ao abrir, o rascunho parte dos filtros aplicados atuais.
  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(filters)
    setOpen(next)
  }

  const apply = () => {
    onApply(draft)
    setOpen(false)
  }

  const clear = () => setDraft(listingSearchSchema.parse({}))

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      title="Filtros"
      description="Refine o que aparece no seu feed."
      trigger={
        <button
          type="button"
          className={cn(
            'inline-flex shrink-0 items-center gap-2 h-11 px-4 rounded-full text-sm font-medium transition-colors',
            'bg-[var(--color-page)] text-[var(--color-body)] border border-[var(--color-border-default)]',
            'hover:bg-[var(--color-border-default)]',
            triggerClassName,
          )}
        >
          <i className="ri-equalizer-line text-base" aria-hidden />
          Filtros
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold">
              {activeCount}
            </span>
          )}
        </button>
      }
      footer={
        <>
          <Button variant="outline" fullWidth onClick={clear}>
            Limpar filtros
          </Button>
          <Button fullWidth onClick={apply}>
            Aplicar filtros
          </Button>
        </>
      }
    >
      <ListingFilters filters={draft} onChange={setDraft} />
    </Drawer>
  )
}
