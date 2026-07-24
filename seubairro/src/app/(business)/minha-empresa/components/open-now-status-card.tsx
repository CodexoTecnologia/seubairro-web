'use client'

import { useEffect, useState } from 'react'
import { BusinessOperationService } from '@/lib/api/services/BusinessOperationService'
import type { BusinessOperationStatusResponse } from '@/lib/api/dtos/Response/business/BusinessOperationStatusResponse'
import { Card } from '@/design-system/primitives/Card'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { cn } from '@/lib/utils/cn'

type Props = {
  businessId: string
  refreshKey?: number
}

const POLL_INTERVAL_MS = 60_000

function formatNextOpenAt(iso: string | null): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleString('pt-BR', {
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatHHmm(value: string | null): string {
  if (!value) return ''
  const [h, m] = value.split(':')
  if (!h || !m) return value
  return `${h}:${m}`
}

export default function OpenNowStatusCard({ businessId, refreshKey = 0 }: Props) {
  const [status, setStatus] = useState<BusinessOperationStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessId) return
    let cancelled = false

    const load = async () => {
      try {
        const data = await BusinessOperationService.getStatus(businessId)
        if (!cancelled) {
          setStatus(data)
          setError(null)
        }
      } catch {
        if (!cancelled) setError('Não foi possível obter o status de funcionamento agora.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    const interval = window.setInterval(load, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [businessId, refreshKey])

  if (loading) {
    return <Skeleton variant="rect" height={108} className="rounded-2xl" />
  }

  if (error || !status) {
    return (
      <Card padding="lg" className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-[var(--color-title)]">Status de Funcionamento</span>
        <span className="text-xs text-[var(--color-muted)]">
          {error ?? 'Sem informações de status disponíveis.'}
        </span>
      </Card>
    )
  }

  const open = status.isOpenNow
  const nextOpen = formatNextOpenAt(status.nextOpenAt)

  return (
    <Card padding="lg" className="flex flex-col gap-4 border-[var(--color-border-default)]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide flex items-center gap-1.5">
          <i className="ri-radar-line text-[var(--color-primary)] text-sm" /> Status em Tempo Real
        </span>
        <span className="text-[11px] text-[var(--color-muted)]">Atualizado automaticamente</span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold border shadow-xs',
              open
                ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success)]/30'
                : 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border-[var(--color-danger)]/30',
            )}
          >
            <span
              className={cn(
                'size-2.5 rounded-full',
                open
                  ? 'bg-[var(--color-success)] animate-pulse ring-4 ring-[var(--color-success)]/20'
                  : 'bg-[var(--color-danger)] ring-4 ring-[var(--color-danger)]/20',
              )}
            />
            {open ? 'Aberto Agora' : 'Fechado no Momento'}
          </span>

          {status.today && (
            <span className="text-sm font-medium text-[var(--color-body)] flex items-center gap-1">
              <i className="ri-calendar-event-line text-[var(--color-muted)]" /> Hoje ({status.today.dayName}):{' '}
              <strong className="text-[var(--color-title)]">
                {status.today.openTime && status.today.closeTime
                  ? `${formatHHmm(status.today.openTime)} às ${formatHHmm(status.today.closeTime)}`
                  : 'sem horário cadastrado'}
              </strong>
            </span>
          )}
        </div>

        {!open && nextOpen && (
          <p className="text-xs text-[var(--color-body)] bg-[var(--color-input)] px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] flex items-center gap-1.5">
            <i className="ri-time-line text-[var(--color-primary)]" />
            Próxima abertura: <strong className="text-[var(--color-title)]">{nextOpen}</strong>
          </p>
        )}
      </div>
    </Card>
  )
}
