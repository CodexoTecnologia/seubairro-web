'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/design-system/primitives/Button'
import type { BusinessSetupStep } from '@/features/business/hooks/useBusinessSetup'

type Props = {
  /** Etapa pendente. Quando `null`, nada é renderizado. */
  step: BusinessSetupStep
}

const CONTENT: Record<
  NonNullable<BusinessSetupStep>,
  { icon: string; title: string; description: string; cta: string; href: string }
> = {
  business: {
    icon: 'ri-store-3-line',
    title: 'Crie sua empresa',
    description:
      'Não encontramos uma empresa vinculada à sua conta. Cadastre sua empresa para começar a usar o painel.',
    cta: 'Cadastrar empresa',
    href: '/minha-empresa',
  },
  address: {
    icon: 'ri-map-pin-2-line',
    title: 'Cadastre o endereço da empresa',
    description:
      'Sua empresa ainda não tem um endereço. Sem ele, seus anúncios não aparecem nas buscas dos clientes. Cadastre o endereço para liberar o painel.',
    cta: 'Cadastrar endereço',
    href: '/minha-empresa#endereco',
  },
}

/**
 * Gate bloqueante (não dispensável) exibido quando a empresa não está
 * totalmente configurada. Não tem botão de fechar, ESC nem clique fora — a
 * única saída é seguir para a etapa pendente. Trava o scroll do body enquanto
 * visível.
 */
export function BusinessSetupModal({ step }: Props) {
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!step) return
    ctaRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [step])

  if (!step) return null

  const { icon, title, description, cta, href } = CONTENT[step]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="business-setup-title"
      aria-describedby="business-setup-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-elevated)] flex flex-col items-center text-center gap-3">
        <span className="size-14 rounded-full bg-[var(--color-page)] flex items-center justify-center">
          <i className={`${icon} text-2xl text-[var(--color-primary)]`} aria-hidden />
        </span>
        <h2 id="business-setup-title" className="text-lg font-semibold text-[var(--color-title)]">
          {title}
        </h2>
        <p id="business-setup-description" className="text-sm text-[var(--color-muted)]">
          {description}
        </p>
        <Link ref={ctaRef} href={href} className="mt-2 w-full">
          <Button fullWidth leftIcon={<i className="ri-arrow-right-line" aria-hidden />}>
            {cta}
          </Button>
        </Link>
      </div>
    </div>
  )
}
