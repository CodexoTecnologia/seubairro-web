'use client'

import { useCallback, useEffect, useState } from 'react'
import { BusinessService, type BusinessResponse } from '@/lib/api/services/BusinessService'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import OperationsManager from './components/operations-manager'
import OpenNowStatusCard from './components/open-now-status-card'
import ClosedStatusToggle from './components/closed-status-toggle'

export default function HorariosPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext()
  const [business, setBusiness] = useState<BusinessResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Bumpa o status-card pra revalidar sempre que algo muda (grade salva, toggle fechado).
  const [statusRefreshKey, setStatusRefreshKey] = useState(0)
  const refreshStatus = useCallback(() => setStatusRefreshKey((k) => k + 1), [])

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !user?.id) {
      setError('Usuário não autenticado.')
      setLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const data = await BusinessService.getByOwnerId(user.id)
        if (!cancelled) setBusiness(data)
      } catch (err) {
        console.error('[horarios] Erro:', err)
        if (!cancelled) setError('Falha ao carregar dados do negócio.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user, isAuthenticated, authLoading])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-4">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rect" height={120} />
        <Skeleton variant="rect" height={240} />
      </div>
    )
  }

  if (error) return <ErrorState title="Não foi possível carregar" description={error} />

  if (!business) {
    return (
      <EmptyState
        icon={<i className="ri-time-line" />}
        title="Nenhum negócio encontrado"
        description="Configure seu negócio para definir os horários de funcionamento."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">Horários</h1>
        <p className="text-[var(--color-muted)] mt-1">
          Defina quando sua loja atende e veja o status em tempo real.
        </p>
      </header>

      <OpenNowStatusCard businessId={business.id} refreshKey={statusRefreshKey} />
      <ClosedStatusToggle
        business={business}
        onChange={(updated) => {
          setBusiness(updated)
          refreshStatus()
        }}
      />
      <OperationsManager businessId={business.id} onSaved={refreshStatus} />
    </div>
  )
}
