'use client'

import { useState } from 'react'
import {
  BusinessOperationService,
  DAYS_WEEK_LABELS,
  toApiTime,
  fromApiTime,
} from '@/lib/api/services/BusinessOperationService'
import type {
  BusinessOperationResponse,
  DaysWeek,
} from '@/lib/api/dtos/Response/business/BusinessOperationResponse'
import { ApiClientError } from '@/lib/api/Client/ApiClientError'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { cn } from '@/lib/utils/cn'

type Props = {
  businessId: string
  initialOperations: BusinessOperationResponse[]
  onSaved?: (enabledCount: number) => void
}

type DayDraft = {
  daysWeek: DaysWeek
  enabled: boolean
  openTime: string
  closeTime: string
}

const DAY_ORDER: DaysWeek[] = [1, 2, 3, 4, 5, 6, 0]

const buildInitialDrafts = (ops: BusinessOperationResponse[]): DayDraft[] => {
  const byDay = new Map<DaysWeek, BusinessOperationResponse>()
  ops.forEach((op) => byDay.set(op.daysWeek, op))
  return DAY_ORDER.map((day) => {
    const op = byDay.get(day)
    return {
      daysWeek: day,
      enabled: Boolean(op),
      openTime: op ? fromApiTime(op.openTime) || '' : '',
      closeTime: op ? fromApiTime(op.closeTime) || '' : '',
    }
  })
}

const ERROR_MESSAGES: Record<string, string> = {
  InvalidOperationDay: 'Dia da semana inválido.',
  DuplicateOperationDay: 'Há dias duplicados no lote — recarregue e tente novamente.',
  InvalidOperationTimeRange: 'O horário de abertura precisa ser anterior ao de fechamento.',
  Forbidden: 'Você não tem permissão para alterar os horários desse negócio.',
}

export default function OperationsManager({ businessId, initialOperations, onSaved }: Props) {
  const [drafts, setDrafts] = useState<DayDraft[]>(() => buildInitialDrafts(initialOperations))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [dirty, setDirty] = useState(false)

  const patchDay = (day: DaysWeek, patch: Partial<DayDraft>) => {
    setDrafts((prev) => prev.map((d) => (d.daysWeek === day ? { ...d, ...patch } : d)))
    setDirty(true)
    setSavedAt(null)
  }

  const validate = (): string | null => {
    for (const d of drafts) {
      if (!d.enabled) continue
      if (!d.openTime || !d.closeTime) {
        return `Informe os horários de abertura e fechamento para ${DAYS_WEEK_LABELS[d.daysWeek]}.`
      }
      if (d.openTime >= d.closeTime) {
        return `Em ${DAYS_WEEK_LABELS[d.daysWeek]}, o horário de abertura (${d.openTime}) precisa ser anterior ao de fechamento (${d.closeTime}).`
      }
    }
    return null
  }

  const handleSave = async () => {
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        operations: drafts
          .filter((d) => d.enabled)
          .map((d) => ({
            daysWeek: d.daysWeek,
            openTime: toApiTime(d.openTime),
            closeTime: toApiTime(d.closeTime),
          })),
      }
      const result = await BusinessOperationService.bulkReplace(businessId, payload)
      setDrafts(buildInitialDrafts(Array.isArray(result) ? result : []))
      setDirty(false)
      setSavedAt(Date.now())
      onSaved?.(payload.operations.length)
    } catch (err) {
      if (err instanceof ApiClientError && ERROR_MESSAGES[err.code]) {
        setError(ERROR_MESSAGES[err.code])
      } else {
        setError('Erro ao salvar horários de funcionamento. Tente novamente.')
      }
    } finally {
      setSaving(false)
    }
  }

  const activeDaysCount = drafts.filter((d) => d.enabled).length

  return (
    <Card padding="lg" className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
        <div className="flex items-center gap-2">
          <span className="size-9 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
            <i className="ri-time-line text-lg" aria-hidden />
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-[var(--color-title)]">
              Grade de Horários Semanal
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Configure os dias e intervalos em que seu estabelecimento atende presencialmente.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedAt && !dirty && (
            <span className="text-xs font-semibold text-[var(--color-success)] bg-[var(--color-success-bg)] px-3 py-1 rounded-full border border-[var(--color-success)]/30 inline-flex items-center gap-1">
              <i className="ri-check-line" /> Grade Salva
            </span>
          )}
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
            {activeDaysCount} {activeDaysCount === 1 ? 'Dia Ativo' : 'Dias Ativos'}
          </span>
        </div>
      </header>

      {error && (
        <div role="alert" className="p-3.5 rounded-xl bg-[var(--color-danger-bg)] text-[var(--color-danger)] text-sm font-medium border border-[var(--color-danger)]/30 flex items-center gap-2">
          <i className="ri-error-warning-fill" /> {error}
        </div>
      )}

      {/* Lista de Dias Semanal */}
      <div className="flex flex-col gap-2.5">
        {drafts.map((d) => (
          <DayRow
            key={d.daysWeek}
            draft={d}
            busy={saving}
            onChange={(patch) => patchDay(d.daysWeek, patch)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-default)]">
        <span className="text-xs text-[var(--color-muted)]">
          {dirty ? 'Você possui alterações não salvas' : 'Todos os horários estão atualizados'}
        </span>
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          leftIcon={saving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
        >
          {saving ? 'Salvando Horários…' : 'Salvar Todos os Horários'}
        </Button>
      </div>
    </Card>
  )
}

type DayRowProps = {
  draft: DayDraft
  busy: boolean
  onChange: (patch: Partial<DayDraft>) => void
}

function DayRow({ draft, busy, onChange }: DayRowProps) {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all',
        draft.enabled
          ? 'border-[var(--color-border-default)] bg-[var(--color-surface)] shadow-xs'
          : 'border-[var(--color-border-default)] bg-[var(--color-page)] opacity-60',
      )}
    >
      <label className="inline-flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={draft.enabled}
          onChange={(e) => onChange({ enabled: e.target.checked })}
          disabled={busy}
          className="size-4 rounded accent-[var(--color-primary)] cursor-pointer"
        />
        <span className="text-sm font-semibold text-[var(--color-title)] w-28">
          {DAYS_WEEK_LABELS[draft.daysWeek]}
        </span>
        <span
          className={cn(
            'text-xs font-semibold px-2.5 py-0.5 rounded-full',
            draft.enabled
              ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success)]/30'
              : 'bg-[var(--color-input)] text-[var(--color-muted)] border border-[var(--color-border-default)]',
          )}
        >
          {draft.enabled ? 'Aberto' : 'Fechado'}
        </span>
      </label>

      {draft.enabled && (
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-1.5 bg-[var(--color-input)] px-2.5 py-1 rounded-lg border border-[var(--color-border-default)]">
            <i className="ri-time-line text-xs text-[var(--color-primary)]" />
            <input
              type="time"
              value={draft.openTime}
              onChange={(e) => onChange({ openTime: e.target.value })}
              disabled={busy || !draft.enabled}
              aria-label={`Horário de abertura — ${DAYS_WEEK_LABELS[draft.daysWeek]}`}
              className="bg-transparent text-sm font-medium text-[var(--color-title)] focus:outline-none disabled:cursor-not-allowed"
            />
          </div>

          <span className="text-xs text-[var(--color-muted)] font-medium">até</span>

          <div className="flex items-center gap-1.5 bg-[var(--color-input)] px-2.5 py-1 rounded-lg border border-[var(--color-border-default)]">
            <i className="ri-time-line text-xs text-[var(--color-primary)]" />
            <input
              type="time"
              value={draft.closeTime}
              onChange={(e) => onChange({ closeTime: e.target.value })}
              disabled={busy || !draft.enabled}
              aria-label={`Horário de fechamento — ${DAYS_WEEK_LABELS[draft.daysWeek]}`}
              className="bg-transparent text-sm font-medium text-[var(--color-title)] focus:outline-none disabled:cursor-not-allowed"
            />
          </div>
        </div>
      )}
    </div>
  )
}
