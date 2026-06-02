'use client'

import { useEffect, useState } from 'react'
import { NicheService } from '@/lib/api/services/NicheService'
import { BusinessNicheService } from '@/lib/api/services/BusinessNicheService'
import type { NicheResponse } from '@/lib/api/dtos/Response/business/NicheResponse'
import type { BusinessNicheResponse } from '@/lib/api/dtos/Response/business/BusinessNicheResponse'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { cn } from '@/lib/utils/cn'

type Props = { businessId: string }

const MAX_NICHES = 3

export default function NichesManager({ businessId }: Props) {
  const [allNiches, setAllNiches] = useState<NicheResponse[]>([])
  const [businessNiches, setBusinessNiches] = useState<BusinessNicheResponse[]>([])
  const [selected, setSelected] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessId) return
    let cancelled = false
    ;(async () => {
      try {
        const [niches, bn] = await Promise.all([
          NicheService.getAll(),
          BusinessNicheService.getByBusiness(businessId),
        ])
        if (cancelled) return
        setAllNiches(Array.isArray(niches) ? niches : [])
        setBusinessNiches(Array.isArray(bn) ? bn : [])
      } catch {
        if (!cancelled) setError('Erro ao carregar nichos.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [businessId])

  const available = allNiches.filter((n) => !businessNiches.some((b) => b.nicheId === n.id))

  const handleAdd = async () => {
    if (!selected) return
    if (businessNiches.length >= MAX_NICHES) {
      setError(`Máximo de ${MAX_NICHES} nichos por negócio.`)
      return
    }
    if (businessNiches.some((b) => b.nicheId === selected)) {
      setError('Este nicho já foi adicionado.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const created = await BusinessNicheService.add(businessId, {
        nicheId: selected,
        isPrincipal: businessNiches.length === 0,
      })
      setBusinessNiches((prev) =>
        created.isPrincipal
          ? [...prev.map((p) => ({ ...p, isPrincipal: false })), created]
          : [...prev, created],
      )
      setSelected('')
    } catch {
      setError('Erro ao adicionar nicho.')
    } finally {
      setBusy(false)
    }
  }

  const handleSetPrincipal = async (id: string) => {
    setBusy(true)
    setError(null)
    try {
      await BusinessNicheService.setPrincipal(businessId, id)
      setBusinessNiches((prev) => prev.map((b) => ({ ...b, isPrincipal: b.id === id })))
    } catch {
      setError('Erro ao definir nicho principal.')
    } finally {
      setBusy(false)
    }
  }

  const handleRemove = async (id: string) => {
    setBusy(true)
    setError(null)
    try {
      await BusinessNicheService.remove(businessId, id)
      setBusinessNiches((prev) => prev.filter((b) => b.id !== id))
    } catch {
      setError('Erro ao remover nicho.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card padding="lg" className="flex flex-col gap-4">
      <header className="flex items-center gap-2">
        <i className="ri-price-tag-3-line text-base text-[var(--color-primary)]" />
        <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
          Nichos do Negócio
        </h2>
      </header>
      <p className="text-sm text-[var(--color-muted)]">
        Selecione até {MAX_NICHES} nichos. Um deles deve ser o principal.
      </p>

      {error && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} variant="rect" height={48} />)
        ) : businessNiches.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">Nenhum nicho adicionado ainda.</p>
        ) : (
          businessNiches.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg border border-[var(--color-border-default)]"
            >
              <div className="flex items-center gap-2">
                <strong className="text-[var(--color-title)]">{b.nicheName}</strong>
                {b.isPrincipal && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] font-medium">
                    Principal
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!b.isPrincipal && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => handleSetPrincipal(b.id)}
                  >
                    Definir principal
                  </Button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleRemove(b.id)}
                  className="size-8 rounded-full text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors flex items-center justify-center"
                  aria-label="Remover nicho"
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {businessNiches.length < MAX_NICHES && (
        <div className="flex gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            disabled={busy || available.length === 0}
            className={cn(
              'flex-1 h-10 px-3 rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
            )}
          >
            <option value="">Selecione um nicho...</option>
            {available.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name}
              </option>
            ))}
          </select>
          <Button type="button" onClick={handleAdd} disabled={busy || !selected}>
            Adicionar
          </Button>
        </div>
      )}
    </Card>
  )
}
