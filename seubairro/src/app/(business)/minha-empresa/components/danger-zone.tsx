'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BusinessService } from '@/lib/api/services/BusinessService'
import { ApiClientError } from '@/lib/api/Client/ApiClientError'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'

type Props = { businessId: string }

export default function DangerZone({ businessId }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDeactivate = async () => {
    setBusy(true)
    setError(null)
    try {
      await BusinessService.delete(businessId)
      router.replace('/dashboard-business')
      router.refresh()
    } catch (err) {
      const text =
        err instanceof ApiClientError && err.code === 'Forbidden'
          ? 'Você não tem permissão para desativar esta empresa.'
          : 'Erro ao desativar a empresa. Tente novamente.'
      setError(text)
      setBusy(false)
    }
  }

  return (
    <Card
      padding="lg"
      className="flex flex-col gap-6 border-2 border-[var(--color-danger)]/40 bg-[var(--color-danger-bg)]/20"
    >
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-danger)]/20 pb-4">
        <div className="flex items-center gap-2">
          <span className="size-9 rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)] flex items-center justify-center">
            <i className="ri-error-warning-line text-lg" aria-hidden />
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-[var(--color-danger)]">
              Zona de Perigo
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Ações irreversíveis e desativação do perfil da sua empresa.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-[var(--color-danger)] text-white">
          <i className="ri-alert-fill" /> Ação Crítica
        </span>
      </header>

      {/* Alerta de Desativação */}
      <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-danger)]/30 flex flex-col gap-2">
        <span className="text-sm font-semibold text-[var(--color-title)] flex items-center gap-1.5">
          <i className="ri-delete-bin-2-line text-[var(--color-danger)]" /> Desativar Empresa
        </span>
        <p className="text-xs text-[var(--color-body)] leading-relaxed">
          Ao desativar a empresa, seu perfil público, seus produtos e todos os anúncios ativos serão removidos das pesquisas dos clientes. Esta ação só poderá ser revertida entrando em contato com o suporte.
        </p>
      </div>

      {error && (
        <div role="alert" className="p-3.5 rounded-xl bg-[var(--color-danger-bg)] text-[var(--color-danger)] text-sm font-medium border border-[var(--color-danger)]/30 flex items-center gap-2">
          <i className="ri-error-warning-fill" /> {error}
        </div>
      )}

      {confirming ? (
        <div className="p-4 rounded-xl bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-danger)]">
            <i className="ri-error-warning-line text-base shrink-0" />
            <span>Tem certeza absoluta que deseja desativar este negócio?</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => setConfirming(false)}
              size="sm"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              isLoading={busy}
              onClick={handleDeactivate}
              size="sm"
              leftIcon={<i className="ri-delete-bin-line" />}
            >
              Sim, Desativar Empresa
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="danger"
            onClick={() => setConfirming(true)}
            leftIcon={<i className="ri-delete-bin-line" />}
          >
            Desativar Negócio
          </Button>
        </div>
      )}
    </Card>
  )
}
