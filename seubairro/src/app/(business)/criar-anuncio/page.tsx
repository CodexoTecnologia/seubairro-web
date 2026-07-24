'use client'

import { useState } from 'react'
import { ListingForm } from '@/features/business/components'
import { PageHeader } from '@/design-system/patterns/PageHeader'
import { cn } from '@/lib/utils/cn'

export default function CriarAnuncioPage() {
  const [adType, setAdType] = useState<'product' | 'service'>('product')

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6">
      <PageHeader
        title="Criar anúncio"
        description="Escolha o tipo e preencha os dados do seu novo anúncio."
      />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setAdType('product')}
          className={cn(
            'flex items-center gap-2 p-4 rounded-[var(--radius-card)] border transition-colors text-left',
            adType === 'product'
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
              : 'border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-body)] hover:border-[var(--color-primary)]/40',
          )}
        >
          <i className="ri-shopping-bag-3-line text-2xl" />
          <strong>Produto</strong>
        </button>
        <button
          type="button"
          onClick={() => setAdType('service')}
          className={cn(
            'flex items-center gap-2 p-4 rounded-[var(--radius-card)] border transition-colors text-left',
            adType === 'service'
              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
              : 'border-[var(--color-border-default)] bg-[var(--color-surface)] text-[var(--color-body)] hover:border-[var(--color-primary)]/40',
          )}
        >
          <i className="ri-hammer-line text-2xl" />
          <strong>Serviço</strong>
        </button>
      </div>

      <ListingForm type={adType} />
    </div>
  )
}
