'use client'

import { Card } from '@/design-system/primitives/Card'
import { cn } from '@/lib/utils/cn'

export type ProfileStep = {
  id: string
  label: string
  /** O que a pessoa ganha ao completar o passo. */
  hint: string
  done: boolean
  /** Âncora da seção correspondente na própria página. */
  href: string
}

type Props = {
  steps: ProfileStep[]
}

/**
 * Progresso de completude do perfil da empresa. Navegação livre por âncoras
 * (nunca um wizard linear): cada passo rola até a seção correspondente.
 * Quando tudo está completo, colapsa em um banner de sucesso discreto.
 */
export default function ProfileProgressCard({ steps }: Props) {
  const doneCount = steps.filter((s) => s.done).length
  const total = steps.length
  const percent = Math.round((doneCount / total) * 100)
  const allDone = doneCount === total

  if (allDone) {
    return (
      <Card
        padding="md"
        className="flex items-center gap-3 border border-[var(--color-success)]/30 bg-[var(--color-success-bg)]"
      >
        <span
          className="size-10 shrink-0 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center"
          aria-hidden
        >
          <i className="ri-check-line text-xl" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[var(--color-success-fg)]">Perfil completo!</p>
          <p className="text-sm text-[var(--color-body)]">
            Seu negócio está com todas as informações no ar. Clientes encontram você com endereço,
            nichos e horários.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <header className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-section-title text-[var(--color-title)]">
          Complete o perfil da sua empresa
        </h2>
        <span className="text-sm font-semibold text-[var(--color-primary)]" data-numeric>
          {doneCount} de {total}
        </span>
      </header>

      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Perfil ${percent}% completo`}
        className="h-2 rounded-full bg-[var(--color-input)] overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-[var(--duration-base)]"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="flex flex-col">
        {steps.map((step, index) => (
          <li key={step.id}>
            <a
              href={step.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-2 py-2.5 min-h-11 transition-colors',
                'hover:bg-[var(--color-page)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
              )}
            >
              {step.done ? (
                <span
                  className="size-6 shrink-0 rounded-full bg-[var(--color-success)] text-white flex items-center justify-center"
                  aria-hidden
                >
                  <i className="ri-check-line text-sm" />
                </span>
              ) : (
                <span
                  className="size-6 shrink-0 rounded-full border-2 border-[var(--color-border-default)] text-[var(--color-muted)] text-xs font-semibold flex items-center justify-center"
                  aria-hidden
                >
                  {index + 1}
                </span>
              )}
              <span className="flex-1 min-w-0">
                <span
                  className={cn(
                    'block text-sm font-medium',
                    step.done ? 'text-[var(--color-muted)]' : 'text-[var(--color-title)]',
                  )}
                >
                  {step.label}
                  {step.done && <span className="sr-only"> — concluído</span>}
                </span>
                {!step.done && (
                  <span className="block text-xs text-[var(--color-muted)]">{step.hint}</span>
                )}
              </span>
              {!step.done && (
                <i
                  className="ri-arrow-right-s-line text-[var(--color-muted)] shrink-0"
                  aria-hidden
                />
              )}
            </a>
          </li>
        ))}
      </ul>
    </Card>
  )
}
