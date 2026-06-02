'use client'

import Link from 'next/link'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { Button } from '@/design-system/primitives/Button'

export default function AnuncioDetalhesPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">
          Detalhes do anúncio
        </h1>
      </header>
      <EmptyState
        icon={<i className="ri-tools-line" />}
        title="Em construção"
        description="A página de detalhes do anúncio será disponibilizada em breve."
        action={
          <Link href="/dashboard-client">
            <Button variant="outline">Voltar ao feed</Button>
          </Link>
        }
      />
    </div>
  )
}
