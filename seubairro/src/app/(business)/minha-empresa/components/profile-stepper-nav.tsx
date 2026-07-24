'use client'

import { Card } from '@/design-system/primitives/Card'
import { cn } from '@/lib/utils/cn'

export type StepId = 'dados' | 'endereco' | 'nichos' | 'horarios' | 'avancado'

export type StepperStep = {
  id: StepId
  title: string
  description: string
  done: boolean
}

type Props = {
  steps: StepperStep[]
  activeStep: StepId
  onSelectStep: (stepId: StepId) => void
}

export default function ProfileStepperNav({ steps, activeStep, onSelectStep }: Props) {
  // Etapas obrigatórias para progresso (excluindo configurações avançadas)
  const coreSteps = steps.filter((s) => s.id !== 'avancado')
  const doneCount = coreSteps.filter((s) => s.done).length
  const total = coreSteps.length
  const percent = Math.round((doneCount / total) * 100)

  return (
    <Card padding="lg" className="flex flex-col gap-6">
      {/* Resumo do Progresso */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-[var(--color-title)]">
              Complete o perfil da sua empresa
            </h2>
            {percent === 100 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--color-success-bg)] text-[var(--color-success)]">
                <i className="ri-checkbox-circle-fill text-xs" /> Perfil 100% Completo
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--color-muted)]">
            Navegue pelas etapas abaixo para preencher os dados e destacar sua empresa no bairro.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-sm font-semibold text-[var(--color-primary)]" data-numeric>
            {doneCount} de {total} concluídos
          </span>
          <span className="text-xs font-bold px-2 py-1 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
            {percent}%
          </span>
        </div>
      </div>

      {/* Barra de Progresso Visual */}
      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Perfil ${percent}% completo`}
        className="h-2 rounded-full bg-[var(--color-input)] overflow-hidden"
      >
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Grid / List de Etapas (Stepper) */}
      <nav aria-label="Etapas do cadastro" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {steps.map((step, index) => {
          const isActive = step.id === activeStep
          const isDone = step.done && step.id !== 'avancado'

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id)}
              className={cn(
                'group flex items-start gap-3 p-3 rounded-xl border text-left transition-all outline-none',
                'focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                isActive
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-sm ring-1 ring-[var(--color-primary)]'
                  : isDone
                    ? 'border-[var(--color-success)]/30 bg-[var(--color-surface)] hover:border-[var(--color-success)]'
                    : 'border-[var(--color-border-default)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-page)]',
              )}
            >
              {/* Ícone / Número de Status */}
              <span
                className={cn(
                  'size-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-transform group-hover:scale-105',
                  isDone
                    ? 'bg-[var(--color-success)] text-white'
                    : isActive
                      ? 'bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-primary)]/30'
                      : 'bg-[var(--color-input)] text-[var(--color-muted)] border border-[var(--color-border-default)]',
                )}
                aria-hidden
              >
                {isDone ? (
                  <i className="ri-check-line text-sm" />
                ) : (
                  index + 1
                )}
              </span>

              {/* Rótulo e Descrição */}
              <div className="flex flex-col min-w-0">
                <span
                  className={cn(
                    'text-xs font-semibold truncate',
                    isActive
                      ? 'text-[var(--color-primary)]'
                      : isDone
                        ? 'text-[var(--color-title)]'
                        : 'text-[var(--color-body)]',
                  )}
                >
                  {step.title}
                </span>
                <span className="text-[11px] text-[var(--color-muted)] truncate">
                  {step.description}
                </span>
              </div>
            </button>
          )
        })}
      </nav>
    </Card>
  )
}
