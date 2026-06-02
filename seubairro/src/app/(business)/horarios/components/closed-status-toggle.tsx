'use client'

import { useState } from 'react'
import { BusinessService, type BusinessResponse } from '@/lib/api/services/BusinessService'
import { ApiClientError } from '@/lib/api/Client/ApiClientError'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { cn } from '@/lib/utils/cn'

type Props = {
  business: BusinessResponse
  onChange: (updated: BusinessResponse) => void
}

const MAX_REASON_LENGTH = 200

const ERROR_MESSAGES: Record<string, string> = {
  ClosedReasonTooLong: 'O motivo deve ter no máximo 200 caracteres.',
  ClosedUntilInvalid: 'A data deve ser futura.',
  Forbidden: 'Você não tem permissão para alterar esse status.',
}

function toDateTimeLocal(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  // datetime-local espera "YYYY-MM-DDTHH:mm" no fuso local
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromDateTimeLocal(value: string): string | null {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export default function ClosedStatusToggle({ business, onChange }: Props) {
  const [isClosed, setIsClosed] = useState(business.isClosed)
  const [reason, setReason] = useState(business.closedReason ?? '')
  const [until, setUntil] = useState(toDateTimeLocal(business.closedUntil))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  const dirty =
    isClosed !== business.isClosed ||
    (isClosed && reason !== (business.closedReason ?? '')) ||
    (isClosed && until !== toDateTimeLocal(business.closedUntil))

  const handleToggle = (next: boolean) => {
    setIsClosed(next)
    if (!next) {
      setReason('')
      setUntil('')
    }
    setSavedAt(null)
  }

  const handleSave = async () => {
    if (isClosed && reason.length > MAX_REASON_LENGTH) {
      setError(ERROR_MESSAGES.ClosedReasonTooLong)
      return
    }
    if (isClosed && until) {
      const parsed = new Date(until)
      if (!Number.isNaN(parsed.getTime()) && parsed.getTime() <= Date.now()) {
        setError(ERROR_MESSAGES.ClosedUntilInvalid)
        return
      }
    }

    setSaving(true)
    setError(null)
    try {
      const updated = await BusinessService.updateClosedStatus(business.id, {
        isClosed,
        reason: isClosed ? (reason.trim() || null) : null,
        until: isClosed ? fromDateTimeLocal(until) : null,
      })
      onChange(updated)
      setSavedAt(Date.now())
    } catch (err) {
      if (err instanceof ApiClientError && ERROR_MESSAGES[err.code]) {
        setError(ERROR_MESSAGES[err.code])
      } else {
        setError('Erro ao atualizar status. Tente novamente.')
      }
    } finally {
      setSaving(false)
    }
  }

  const reasonRemaining = MAX_REASON_LENGTH - reason.length

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <i
            className={cn(
              'text-base',
              isClosed ? 'ri-pause-circle-line text-[var(--color-danger)]' : 'ri-shield-check-line text-[var(--color-success)]',
            )}
          />
          <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
            Fechado Temporariamente
          </h2>
        </div>
        {savedAt && !dirty && (
          <span className="text-xs text-[var(--color-success)] inline-flex items-center gap-1">
            <i className="ri-check-line" /> Salvo
          </span>
        )}
      </header>

      <p className="text-xs text-[var(--color-muted)]">
        Use quando precisar pausar atendimento sem perder a grade semanal — por exemplo, em
        férias, reforma ou feriado prolongado.
      </p>

      <label className="inline-flex items-center gap-3 cursor-pointer select-none">
        <span
          className={cn(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            isClosed ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-border-default)]',
          )}
        >
          <span
            className={cn(
              'inline-block size-4 transform rounded-full bg-white transition-transform',
              isClosed ? 'translate-x-6' : 'translate-x-1',
            )}
          />
          <input
            type="checkbox"
            checked={isClosed}
            onChange={(e) => handleToggle(e.target.checked)}
            disabled={saving}
            className="sr-only"
          />
        </span>
        <span className="text-sm font-medium text-[var(--color-title)]">
          {isClosed ? 'Loja fechada temporariamente' : 'Loja operando normalmente'}
        </span>
      </label>

      {isClosed && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="closed-reason" className="text-xs text-[var(--color-body)]">
              Motivo (opcional)
            </label>
            <textarea
              id="closed-reason"
              value={reason}
              maxLength={MAX_REASON_LENGTH}
              onChange={(e) => setReason(e.target.value)}
              disabled={saving}
              rows={2}
              placeholder="Ex: Férias coletivas até 02/06"
              className="px-3 py-2 rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            />
            <span
              className={cn(
                'text-xs self-end',
                reasonRemaining < 20
                  ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-muted)]',
              )}
            >
              {reasonRemaining} caracteres restantes
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="closed-until" className="text-xs text-[var(--color-body)]">
              Reabrir automaticamente em (opcional)
            </label>
            <input
              id="closed-until"
              type="datetime-local"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              disabled={saving}
              className="h-10 px-3 rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <span className="text-xs text-[var(--color-muted)]">
              Quando essa data passar, a loja volta a aparecer aberta automaticamente.
            </span>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end pt-1">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          variant={isClosed ? 'danger' : 'primary'}
          leftIcon={saving ? <i className="ri-loader-4-line animate-spin" /> : undefined}
        >
          {saving ? 'Salvando…' : 'Salvar status'}
        </Button>
      </div>
    </Card>
  )
}
