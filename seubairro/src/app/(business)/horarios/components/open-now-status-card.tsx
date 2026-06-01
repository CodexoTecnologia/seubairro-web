'use client'

import { useEffect, useState } from 'react'
import { BusinessOperationService } from '@/lib/api/services/BusinessOperationService'
import type { BusinessOperationStatusResponse } from '@/lib/api/dtos/Response/business/BusinessOperationStatusResponse'
import { Card } from '@/design-system/primitives/Card'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { cn } from '@/lib/utils/cn'

type Props = {
  businessId: string
  /** Aumente pra forçar refetch fora do polling — após salvar grade/status. */
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
        if (!cancelled) setError('Não foi possível obter o status agora.')
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
    return <Skeleton variant="rect" height={108} />
  }

  if (error || !status) {
    return (
      <Card padding="lg" className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-[var(--color-title)]">Status</span>
        <span className="text-sm text-[var(--color-muted)]">
          {error ?? 'Sem informações de status.'}
        </span>
      </Card>
    )
  }

  const open = status.isOpenNow
  const nextOpen = formatNextOpenAt(status.nextOpenAt)

  return (
    <Card padding="lg" className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold',
            open
              ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
              : 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
          )}
        >
          <span
            className={cn(
              'size-2 rounded-full',
              open
                ? 'bg-[var(--color-success)] animate-pulse'
                : 'bg-[var(--color-danger)]',
            )}
          />
          {open ? 'Aberto agora' : 'Fechado'}
        </span>
        {status.today && (
          <span className="text-sm text-[var(--color-muted)]">
            Hoje ({status.today.dayName}):{' '}
            {status.today.openTime && status.today.closeTime
              ? `${formatHHmm(status.today.openTime)} – ${formatHHmm(status.today.closeTime)}`
              : 'sem horário cadastrado'}
          </span>
        )}
      </div>
      {!open && nextOpen && (
        <p className="text-sm text-[var(--color-body)]">
          <i className="ri-time-line text-[var(--color-primary)] mr-1.5" />
          Próxima abertura: <strong>{nextOpen}</strong>
        </p>
      )}
    </Card>
  )
}
