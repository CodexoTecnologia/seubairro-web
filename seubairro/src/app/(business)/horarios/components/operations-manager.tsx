'use client'

import { useState, useEffect } from 'react'
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
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { cn } from '@/lib/utils/cn'

type Props = {
  businessId: string
  onSaved?: () => void
}

type DayDraft = {
  daysWeek: DaysWeek
  enabled: boolean
  openTime: string
  closeTime: string
}

const DAY_ORDER: DaysWeek[] = [1, 2, 3, 4, 5, 6, 0]
const DEFAULT_OPEN = '08:00'
const DEFAULT_CLOSE = '18:00'

const buildInitialDrafts = (ops: BusinessOperationResponse[]): DayDraft[] => {
  const byDay = new Map<DaysWeek, BusinessOperationResponse>()
  ops.forEach((op) => byDay.set(op.daysWeek, op))
  return DAY_ORDER.map((day) => {
    const op = byDay.get(day)
    return {
      daysWeek: day,
      enabled: Boolean(op),
      openTime: op ? fromApiTime(op.openTime) || DEFAULT_OPEN : DEFAULT_OPEN,
      closeTime: op ? fromApiTime(op.closeTime) || DEFAULT_CLOSE : DEFAULT_CLOSE,
    }
  })
}

const ERROR_MESSAGES: Record<string, string> = {
  InvalidOperationDay: 'Dia da semana inválido.',
  DuplicateOperationDay: 'Há dias duplicados no payload — recarregue e tente novamente.',
  InvalidOperationTimeRange: 'Horário de abertura precisa ser anterior ao de fechamento.',
  Forbidden: 'Você não tem permissão para alterar os horários desse negócio.',
}

export default function OperationsManager({ businessId, onSaved }: Props) {
  const [drafts, setDrafts] = useState<DayDraft[]>(() => buildInitialDrafts([]))
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (!businessId) return
    let cancelled = false
    ;(async () => {
      try {
        const data = await BusinessOperationService.getByBusiness(businessId)
        if (cancelled) return
        setDrafts(buildInitialDrafts(Array.isArray(data) ? data : []))
        setDirty(false)
      } catch {
        if (!cancelled) setError('Erro ao carregar horários.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [businessId])

  const patchDay = (day: DaysWeek, patch: Partial<DayDraft>) => {
    setDrafts((prev) => prev.map((d) => (d.daysWeek === day ? { ...d, ...patch } : d)))
    setDirty(true)
    setSavedAt(null)
  }

  const validate = (): string | null => {
    for (const d of drafts) {
      if (!d.enabled) continue
      if (!d.openTime || !d.closeTime) {
        return `Informe os horários para ${DAYS_WEEK_LABELS[d.daysWeek]}.`
      }
      if (d.openTime >= d.closeTime) {
        return `Em ${DAYS_WEEK_LABELS[d.daysWeek]}, o horário de abertura precisa ser anterior ao de fechamento.`
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
      onSaved?.()
    } catch (err) {
      if (err instanceof ApiClientError && ERROR_MESSAGES[err.code]) {
        setError(ERROR_MESSAGES[err.code])
      } else {
        setError('Erro ao salvar horários. Tente novamente.')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <i className="ri-time-line text-base text-[var(--color-primary)]" />
          <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
            Horários de Funcionamento
          </h2>
        </div>
        {savedAt && !dirty && (
          <span className="text-xs text-[var(--color-success)] inline-flex items-center gap-1">
            <i className="ri-check-line" /> Salvo
          </span>
        )}
      </header>

      <p className="text-xs text-[var(--color-muted)]">
        Marque os dias em que a loja atende. Dias desmarcados aparecem como{' '}
        <strong>fechado</strong> no perfil público.
      </p>

      {error && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} variant="rect" height={52} />)
        ) : (
          drafts.map((d) => (
            <DayRow
              key={d.daysWeek}
              draft={d}
              busy={saving}
              onChange={(patch) => patchDay(d.daysWeek, patch)}
            />
          ))
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || loading || !dirty}
          leftIcon={saving ? <i className="ri-loader-4-line animate-spin" /> : undefined}
        >
          {saving ? 'Salvando…' : 'Salvar tudo'}
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
        'grid grid-cols-[auto_1fr_auto_auto] gap-3 items-center p-3 rounded-lg border transition-colors',
        draft.enabled
          ? 'border-[var(--color-border-default)] bg-[var(--color-surface)]'
          : 'border-[var(--color-border-default)] bg-[var(--color-page)] opacity-70',
      )}
    >
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={draft.enabled}
          onChange={(e) => onChange({ enabled: e.target.checked })}
          disabled={busy}
          className="size-4 accent-[var(--color-primary)] cursor-pointer"
        />
        <span className="text-sm font-medium text-[var(--color-title)] w-24">
          {DAYS_WEEK_LABELS[draft.daysWeek]}
        </span>
      </label>
      <span className="text-xs text-[var(--color-muted)]">
        {draft.enabled ? 'Atende neste dia' : 'Fechado'}
      </span>
      <input
        type="time"
        value={draft.openTime}
        onChange={(e) => onChange({ openTime: e.target.value })}
        disabled={busy || !draft.enabled}
        aria-label={`Horário de abertura — ${DAYS_WEEK_LABELS[draft.daysWeek]}`}
        className="h-9 px-2 rounded-md bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <input
        type="time"
        value={draft.closeTime}
        onChange={(e) => onChange({ closeTime: e.target.value })}
        disabled={busy || !draft.enabled}
        aria-label={`Horário de fechamento — ${DAYS_WEEK_LABELS[draft.daysWeek]}`}
        className="h-9 px-2 rounded-md bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  )
}
