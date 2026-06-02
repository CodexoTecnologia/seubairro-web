'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProfileForm from './components/profile-form'
import NichesManager from './components/niches-manager'
import { Card } from '@/design-system/primitives/Card'
import { BusinessService, type BusinessResponse } from '@/lib/api/services/BusinessService'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { EmptyState } from '@/design-system/patterns/EmptyState'

export default function EditarProfilePage() {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext()
  const [business, setBusiness] = useState<BusinessResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        console.error('[editar-profile] Erro:', err)
        if (!cancelled) setError('Falha ao carregar dados do perfil.')
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
        <Skeleton variant="rect" height={200} />
        <Skeleton variant="rect" height={120} />
      </div>
    )
  }

  if (error) return <ErrorState title="Não foi possível carregar" description={error} />

  if (!business) {
    return (
      <EmptyState
        icon={<i className="ri-store-line" />}
        title="Nenhum negócio encontrado"
        description="Crie seu negócio para começar a divulgar."
      />
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">Editar Perfil</h1>
        <p className="text-[var(--color-muted)] mt-1">
          Gerencie as informações que seus clientes veem.
        </p>
      </header>

      <ProfileForm initialData={business} />
      <NichesManager businessId={business.id} />

      <Card padding="lg" className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <i className="ri-time-line text-xl text-[var(--color-primary)]" />
          <div className="flex flex-col">
            <strong className="text-sm text-[var(--color-title)]">
              Horários de Funcionamento
            </strong>
            <span className="text-xs text-[var(--color-muted)]">
              Gerencie a grade semanal e veja o status em tempo real.
            </span>
          </div>
        </div>
        <Link
          href="/horarios"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          Abrir
          <i className="ri-arrow-right-line" />
        </Link>
      </Card>
    </div>
  )
}
