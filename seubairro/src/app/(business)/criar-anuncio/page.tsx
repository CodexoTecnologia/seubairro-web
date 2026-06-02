'use client'

import { useState } from 'react'
import ListingForm from './components/listing-form'
import { cn } from '@/lib/utils/cn'

export default function CriarAnuncioPage() {
  const [adType, setAdType] = useState<'product' | 'service'>('product')

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">
          Criar anúncio
        </h1>
        <p className="text-[var(--color-muted)] mt-1">
          Escolha o tipo e preencha os dados do seu novo anúncio.
        </p>
      </header>

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
