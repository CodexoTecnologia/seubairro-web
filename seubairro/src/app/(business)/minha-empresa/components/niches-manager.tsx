'use client'

import { useEffect, useState } from 'react'
import { NicheService } from '@/lib/api/services/NicheService'
import { BusinessNicheService } from '@/lib/api/services/BusinessNicheService'
import type { NicheResponse } from '@/lib/api/dtos/Response/business/NicheResponse'
import type { BusinessNicheResponse } from '@/lib/api/dtos/Response/business/BusinessNicheResponse'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { cn } from '@/lib/utils/cn'

type Props = {
  businessId: string
  initialBusinessNiches: BusinessNicheResponse[]
  onCountChange?: (count: number) => void
}

const MAX_NICHES = 3

export default function NichesManager({
  businessId,
  initialBusinessNiches,
  onCountChange,
}: Props) {
  const [allNiches, setAllNiches] = useState<NicheResponse[]>([])
  const [businessNiches, setBusinessNiches] =
    useState<BusinessNicheResponse[]>(initialBusinessNiches)
  const [selected, setSelected] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const niches = await NicheService.getAll()
        if (!cancelled) setAllNiches(Array.isArray(niches) ? niches : [])
      } catch {
        if (!cancelled) setError('Erro ao carregar a lista de nichos de mercado.')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const available = allNiches.filter((n) => !businessNiches.some((b) => b.nicheId === n.id))

  const handleAdd = async () => {
    if (!selected) return
    if (businessNiches.length >= MAX_NICHES) {
      setError(`Sua empresa pode ter no máximo ${MAX_NICHES} nichos de atuação.`)
      return
    }
    if (businessNiches.some((b) => b.nicheId === selected)) {
      setError('Este nicho já foi adicionado ao seu negócio.')
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
      onCountChange?.(businessNiches.length + 1)
      setSelected('')
    } catch {
      setError('Erro ao adicionar nicho. Tente novamente.')
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
      onCountChange?.(businessNiches.length - 1)
    } catch {
      setError('Erro ao remover nicho.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card padding="lg" className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
        <div className="flex items-center gap-2">
          <span className="size-9 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
            <i className="ri-price-tag-3-line text-lg" aria-hidden />
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-[var(--color-title)]">
              Nichos de Atuação
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Os nichos conectam sua empresa aos filtros que os clientes utilizam na busca.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20">
          <i className="ri-folders-line" /> {businessNiches.length} de {MAX_NICHES} Nichos
        </span>
      </header>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-[var(--color-danger-bg)] text-[var(--color-danger)] text-sm font-medium border border-[var(--color-danger)]/30 flex items-center gap-2">
          <i className="ri-error-warning-fill" /> {error}
        </div>
      )}

      {/* Lista de Nichos Adicionados */}
      <div className="flex flex-col gap-3">
        {businessNiches.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed border-[var(--color-border-default)] bg-[var(--color-input)] text-center gap-2">
            <span className="size-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
              <i className="ri-price-tag-3-line text-2xl" />
            </span>
            <span className="text-sm font-semibold text-[var(--color-title)]">
              Nenhum nicho adicionado ainda
            </span>
            <span className="text-xs text-[var(--color-muted)] max-w-xs">
              Adicione pelo menos 1 nicho para que sua empresa apareça nos resultados por categoria.
            </span>
          </div>
        ) : (
          businessNiches.map((b) => (
            <div
              key={b.id}
              className={cn(
                'flex items-center justify-between gap-3 p-4 rounded-xl border transition-all',
                b.isPrincipal
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-xs'
                  : 'border-[var(--color-border-default)] bg-[var(--color-surface)] hover:border-[var(--color-border-default)]',
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'size-9 rounded-lg flex items-center justify-center text-sm font-semibold',
                    b.isPrincipal
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-[var(--color-input)] text-[var(--color-muted)] border border-[var(--color-border-default)]',
                  )}
                >
                  <i className={b.isPrincipal ? 'ri-star-fill' : 'ri-price-tag-3-line'} />
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-[var(--color-title)]">
                    {b.nicheName}
                  </span>
                  {b.isPrincipal ? (
                    <span className="text-[11px] font-medium text-[var(--color-primary)] flex items-center gap-1">
                      <i className="ri-checkbox-circle-fill text-xs" /> Nicho Principal da Empresa
                    </span>
                  ) : (
                    <span className="text-[11px] text-[var(--color-muted)]">Nicho secundário</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!b.isPrincipal && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => handleSetPrincipal(b.id)}
                    leftIcon={<i className="ri-star-line text-xs" />}
                  >
                    Definir Principal
                  </Button>
                )}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => handleRemove(b.id)}
                  className="size-9 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors flex items-center justify-center border border-transparent hover:border-[var(--color-danger)]/20"
                  aria-label={`Remover nicho ${b.nicheName}`}
                  title="Remover nicho"
                >
                  <i className="ri-delete-bin-line text-base" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Adicionar Novo Nicho */}
      {businessNiches.length < MAX_NICHES && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[var(--color-border-default)]">
          <div className="relative flex-1">
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              disabled={busy || available.length === 0}
              aria-label="Selecionar nicho para adicionar"
              className={cn(
                'w-full h-11 px-3.5 rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm transition-all',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
              )}
            >
              <option value="">
                {available.length === 0 ? 'Carregando lista de nichos…' : 'Selecione um nicho para adicionar…'}
              </option>
              {available.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="button"
            onClick={handleAdd}
            disabled={busy || !selected}
            leftIcon={<i className="ri-add-line" />}
          >
            Adicionar Nicho
          </Button>
        </div>
      )}
    </Card>
  )
}
