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
  ClosedUntilInvalid: 'A data de reabertura deve ser futura.',
  Forbidden: 'Você não tem permissão para alterar o status da empresa.',
}

function toDateTimeLocal(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
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
        setError('Erro ao atualizar status de fechamento. Tente novamente.')
      }
    } finally {
      setSaving(false)
    }
  }

  const reasonRemaining = MAX_REASON_LENGTH - reason.length

  return (
    <Card padding="lg" className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <header className="flex items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'size-9 rounded-lg flex items-center justify-center text-lg',
              isClosed
                ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]'
                : 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
            )}
          >
            <i className={isClosed ? 'ri-pause-circle-line' : 'ri-shield-check-line'} />
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-[var(--color-title)]">
              Pausa Temporária
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Pause o atendimento (ex.: férias, reforma) sem apagar sua grade de horários semanal.
            </p>
          </div>
        </div>

        {savedAt && !dirty && (
          <span className="text-xs font-semibold text-[var(--color-success)] bg-[var(--color-success-bg)] px-3 py-1 rounded-full border border-[var(--color-success)]/30 inline-flex items-center gap-1">
            <i className="ri-check-line" /> Salvo com Sucesso
          </span>
        )}
      </header>

      {/* Switch de Ativação */}
      <div
        className={cn(
          'flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all cursor-pointer select-none',
          isClosed
            ? 'border-[var(--color-danger)]/30 bg-[var(--color-danger-bg)]'
            : 'border-[var(--color-border-default)] bg-[var(--color-surface)]',
        )}
        onClick={() => !saving && handleToggle(!isClosed)}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors',
              isClosed ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-border-default)]',
            )}
          >
            <span
              className={cn(
                'inline-block size-5 transform rounded-full bg-white transition-transform shadow-xs',
                isClosed ? 'translate-x-6' : 'translate-x-1',
              )}
            />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[var(--color-title)]">
              {isClosed ? 'Loja Fechada Temporariamente' : 'Loja Operando Normalmente'}
            </span>
            <span className="text-xs text-[var(--color-muted)]">
              {isClosed
                ? 'Sua empresa aparece como pausada para os clientes'
                : 'Sua empresa segue os horários semanais cadastrados'}
            </span>
          </div>
        </div>

        <span
          className={cn(
            'text-xs font-semibold px-3 py-1 rounded-full self-start sm:self-auto',
            isClosed
              ? 'bg-[var(--color-danger)] text-white'
              : 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success)]/30',
          )}
        >
          {isClosed ? 'Pausada' : 'Normal'}
        </span>
      </div>

      {/* Opções quando Fechado */}
      {isClosed && (
        <div className="flex flex-col gap-4 p-4 rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)] animate-fade-in">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="closed-reason"
              className="text-xs font-semibold text-[var(--color-title)] flex items-center gap-1.5"
            >
              <i className="ri-file-text-line text-[var(--color-primary)]" /> Motivo da Pausa (exibido ao cliente)
            </label>
            <textarea
              id="closed-reason"
              value={reason}
              maxLength={MAX_REASON_LENGTH}
              onChange={(e) => setReason(e.target.value)}
              disabled={saving}
              rows={2}
              placeholder="Ex: Férias coletivas da equipe. Voltamos em breve!"
              className="px-3.5 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            />
            <span
              className={cn(
                'text-xs self-end font-medium',
                reasonRemaining < 20
                  ? 'text-[var(--color-warning)]'
                  : 'text-[var(--color-muted)]',
              )}
            >
              {reasonRemaining} caracteres restantes
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="closed-until"
              className="text-xs font-semibold text-[var(--color-title)] flex items-center gap-1.5"
            >
              <i className="ri-calendar-check-line text-[var(--color-primary)]" /> Reabrir Automático em (opcional)
            </label>
            <input
              id="closed-until"
              type="datetime-local"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              disabled={saving}
              className="h-11 px-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
              <i className="ri-information-line text-[var(--color-primary)]" />
              Após esta data/hora, a loja volta a operar nos horários normais.
            </span>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-[var(--color-danger-bg)] text-[var(--color-danger)] text-sm font-medium border border-[var(--color-danger)]/30 flex items-center gap-2">
          <i className="ri-error-warning-fill" /> {error}
        </div>
      )}

      <div className="flex items-center justify-end">
        <Button
          type="button"
          onClick={handleSave}
          disabled={saving || !dirty}
          variant={isClosed ? 'danger' : 'primary'}
          leftIcon={saving ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-line" />}
        >
          {saving ? 'Salvando Status…' : 'Salvar Alterações de Status'}
        </Button>
      </div>
    </Card>
  )
}
