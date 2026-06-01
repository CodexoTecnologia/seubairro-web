'use client'

import { useEffect, useRef, useState } from 'react'
import { PublicBusinessService } from '@/lib/api/services/PublicBusinessService'
import type { BusinessOperationStatusResponse } from '@/lib/api/dtos/Response/business/BusinessOperationStatusResponse'
import { cn } from '@/lib/utils/cn'

type Props = {
  /** Slug do negócio. Quando ausente, o badge se omite (no-op). */
  slug?: string | null
  /** Modo compacto (chip pequeno) — útil em cards densos. */
  size?: 'sm' | 'md'
  className?: string
}

// Cache módulo-level: dedup em todos os cards do mesmo business
// e dispensa fetch repetido quando o usuário rola pra cima/baixo.
type CacheEntry = {
  promise: Promise<BusinessOperationStatusResponse>
  data?: BusinessOperationStatusResponse
  fetchedAt: number
}
const STATUS_CACHE = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 60_000

function getOrFetch(slug: string): Promise<BusinessOperationStatusResponse> {
  const existing = STATUS_CACHE.get(slug)
  const now = Date.now()
  if (existing && now - existing.fetchedAt < CACHE_TTL_MS) {
    return existing.promise
  }
  const promise = PublicBusinessService.getStatusBySlug(slug)
  const entry: CacheEntry = { promise, fetchedAt: now }
  STATUS_CACHE.set(slug, entry)
  promise
    .then((data) => {
      entry.data = data
    })
    .catch(() => {
      STATUS_CACHE.delete(slug)
    })
  return promise
}

export function OpenNowBadge({ slug, size = 'sm', className }: Props) {
  const elRef = useRef<HTMLSpanElement | null>(null)
  const [status, setStatus] = useState<BusinessOperationStatusResponse | null>(() => {
    if (!slug) return null
    return STATUS_CACHE.get(slug)?.data ?? null
  })
  // Sem IntersectionObserver (SSR, ambientes legados) → marcamos visível desde já.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  // Observa entrada no viewport pra não fazer fetch de cards fora da tela.
  useEffect(() => {
    if (!slug || status || visible) return
    const el = elRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [slug, status, visible])

  useEffect(() => {
    if (!slug || !visible || status) return
    let cancelled = false
    getOrFetch(slug)
      .then((data) => {
        if (!cancelled) setStatus(data)
      })
      .catch(() => {
        // Falha silenciosa: badge fica oculto, não polui o feed com erro.
      })
    return () => {
      cancelled = true
    }
  }, [slug, visible, status])

  if (!slug) return null

  // Enquanto não tem dado, ainda renderiza o span (necessário pro IntersectionObserver).
  if (!status) {
    return <span ref={elRef} className={cn('inline-block', className)} aria-hidden="true" />
  }

  const open = status.isOpenNow
  const sizing =
    size === 'sm'
      ? 'text-[10px] px-1.5 py-0.5 gap-1'
      : 'text-xs px-2 py-1 gap-1.5'
  const dotSize = size === 'sm' ? 'size-1' : 'size-1.5'

  return (
    <span
      ref={elRef}
      className={cn(
        'inline-flex items-center rounded-full font-semibold whitespace-nowrap',
        sizing,
        open
          ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
          : 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
        className,
      )}
      title={open ? 'Aberto agora' : 'Fechado'}
    >
      <span
        className={cn(
          'rounded-full',
          dotSize,
          open ? 'bg-[var(--color-success)] animate-pulse' : 'bg-[var(--color-danger)]',
        )}
      />
      {open ? 'Aberto' : 'Fechado'}
    </span>
  )
}
