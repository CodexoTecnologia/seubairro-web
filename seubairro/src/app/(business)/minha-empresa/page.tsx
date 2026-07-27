'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  BusinessService,
  type BusinessResponse,
  type BusinessOwnerOverviewResponse,
} from '@/lib/api/services/BusinessService'
import type {
  BusinessAddressResponse,
  BusinessNicheResponse,
  BusinessOperationResponse,
} from '@/lib/api/dtos/Response/index'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { PageHeader } from '@/design-system/patterns/PageHeader'
import { cn } from '@/lib/utils/cn'
import MinhaEmpresaSkeleton from './components/minha-empresa-skeleton'
import CreateBusinessSection from './components/create-business-section'
import ProfileStepperNav, { type StepId, type StepperStep } from './components/profile-stepper-nav'
import BusinessProfileSection from './components/business-profile-section'
import BusinessAddressSection from './components/business-address-section'
import DangerZone from './components/danger-zone'
import NichesManager from './components/niches-manager'
import OperationsManager from './components/operations-manager'
import ClosedStatusToggle from './components/closed-status-toggle'
import OpenNowStatusCard from './components/open-now-status-card'

const STEP_ORDER: StepId[] = ['dados', 'endereco', 'nichos', 'horarios', 'avancado']

export default function MinhaEmpresaPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext()
  const [business, setBusiness] = useState<BusinessResponse | null>(null)
  const [address, setAddress] = useState<BusinessAddressResponse | null>(null)
  const [niches, setNiches] = useState<BusinessNicheResponse[]>([])
  const [operations, setOperations] = useState<BusinessOperationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeStep, setActiveStep] = useState<StepId>('dados')
  const [statusRefreshKey, setStatusRefreshKey] = useState(0)

  const refreshStatus = useCallback(() => setStatusRefreshKey((k) => k + 1), [])
  const [nichesCount, setNichesCount] = useState(0)
  const [operationsCount, setOperationsCount] = useState(0)

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
        const overview: BusinessOwnerOverviewResponse | null =
          await BusinessService.getOwnerOverview(user.id)
        if (cancelled) return
        setBusiness(overview?.business ?? null)
        setAddress(overview?.address ?? null)
        setNiches(overview?.niches ?? [])
        setOperations(overview?.operations ?? [])
        setNichesCount((overview?.niches ?? []).length)
        setOperationsCount((overview?.operations ?? []).length)
      } catch {
        if (!cancelled) setError('Falha ao carregar os dados da empresa.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id, isAuthenticated, authLoading])

  useEffect(() => {
    if (loading) return
    const rawHash = window.location.hash.replace('#', '') as StepId
    if (STEP_ORDER.includes(rawHash)) {
      setActiveStep(rawHash)
    }
  }, [loading])

  const handleSelectStep = useCallback((step: StepId) => {
    setActiveStep(step)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${step}`)
    }
  }, [])

  const steps: StepperStep[] = useMemo(
    () => [
      {
        id: 'dados',
        title: 'Dados & Identidade',
        description: 'Nome, bio, logo e capa (fotos opcionais)',
        done: Boolean(business?.businessName?.trim() && business?.description?.trim() && business?.logoUrl),
      },
      {
        id: 'endereco',
        title: 'Endereço',
        description: 'CEP e busca por proximidade',
        done: Boolean(address),
      },
      {
        id: 'nichos',
        title: 'Nichos de Atuação',
        description: 'Filtros da busca',
        done: nichesCount > 0,
      },
      {
        id: 'horarios',
        title: 'Horários & Status',
        description: 'Selo "aberto agora"',
        done: operationsCount > 0,
      },
      {
        id: 'avancado',
        title: 'Opções Avançadas',
        description: 'Zona de perigo',
        done: true,
      },
    ],
    [business, address, nichesCount, operationsCount],
  )

  if (loading) {
    return <MinhaEmpresaSkeleton />
  }

  if (error) return <ErrorState title="Não foi possível carregar" description={error} />

  if (!business) {
    return (
      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6">
        <PageHeader
          title="Cadastrar Minha Empresa"
          description="Acompanhe o passo a passo interativo para cadastrar os dados do seu negócio e ser visto no bairro."
        />

        <CreateBusinessSection
          onCreated={(overview) => {
            setBusiness(overview.business)
            setAddress(overview.address)
            setNiches(overview.niches)
            setOperations(overview.operations)
          }}
        />
      </div>
    )
  }

  const currentIndex = STEP_ORDER.indexOf(activeStep)
  const prevStep = currentIndex > 0 ? STEP_ORDER[currentIndex - 1] : null
  const nextStep = currentIndex < STEP_ORDER.length - 1 ? STEP_ORDER[currentIndex + 1] : null

  const principalNiche = niches.find((n) => n.isPrincipal) ?? niches[0] ?? null
  const formattedAddress = address
    ? [address.neighborhood, address.city, address.stateProvince].filter(Boolean).join(', ')
    : null

  return (
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6">
      <PageHeader
        eyebrow={business.businessName ?? undefined}
        title="Minha Empresa"
        description="Gerencie as informações do seu negócio por etapas simples e organizadas."
      />

      {/* Stepper / Barra de Progresso em Páginas */}
      <ProfileStepperNav
        steps={steps}
        activeStep={activeStep}
        onSelectStep={handleSelectStep}
      />

      {/* Conteúdo Principal em Grid Widescreen (Formulários + Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Coluna Esquerda: Formulários da Etapa Ativa */}
        <div className="flex flex-col gap-6 min-w-0">
          <div className="min-h-[400px]">
            {activeStep === 'dados' && (
              <BusinessProfileSection business={business} onUpdated={setBusiness} />
            )}

            {activeStep === 'endereco' && (
              <BusinessAddressSection businessId={business.id} address={address} onSaved={setAddress} />
            )}

            {activeStep === 'nichos' && (
              <NichesManager
                businessId={business.id}
                initialBusinessNiches={niches}
                onCountChange={setNichesCount}
              />
            )}

            {activeStep === 'horarios' && (
              <section className="flex flex-col gap-6">
                <h2 className="text-section-title text-[var(--color-title)] font-bold">
                  Horários &amp; Disponibilidade
                </h2>
                <OpenNowStatusCard businessId={business.id} refreshKey={statusRefreshKey} />
                <ClosedStatusToggle
                  business={business}
                  onChange={(updated) => {
                    setBusiness(updated)
                    refreshStatus()
                  }}
                />
                <OperationsManager
                  businessId={business.id}
                  initialOperations={operations}
                  onSaved={(enabledCount) => {
                    setOperationsCount(enabledCount)
                    refreshStatus()
                  }}
                />
              </section>
            )}

            {activeStep === 'avancado' && <DangerZone businessId={business.id} />}
          </div>

          {/* Controles de Navegação por Páginas (Rodapé) */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-default)] shadow-xs">
            <Button
              type="button"
              variant="outline"
              disabled={!prevStep}
              onClick={() => prevStep && handleSelectStep(prevStep)}
              leftIcon={<i className="ri-arrow-left-line" />}
            >
              Voltar
            </Button>

            <span className="text-xs text-[var(--color-muted)] font-medium hidden sm:inline">
              Etapa {currentIndex + 1} de {STEP_ORDER.length}
            </span>

            {nextStep ? (
              <Button
                type="button"
                onClick={() => handleSelectStep(nextStep)}
                rightIcon={<i className="ri-arrow-right-line" />}
              >
                Próximo Passo
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSelectStep('dados')}
                leftIcon={<i className="ri-refresh-line" />}
              >
                Voltar ao Início
              </Button>
            )}
          </div>
        </div>

        {/* Coluna Direita: Preview do Perfil da Empresa ao Vivo (Sticky Sidebar) */}
        <aside className="lg:sticky lg:top-24 flex flex-col gap-6 min-w-0">
          <Card padding="none" className="overflow-hidden shadow-md border-[var(--color-border-default)] flex flex-col">
            {/* Banner da Capa */}
            <div className="relative w-full h-32 bg-gradient-to-r from-teal-900 via-slate-900 to-blue-900">
              {business.coverImageUrl ? (
                <Image
                  src={business.coverImageUrl}
                  alt={`Capa de ${business.businessName}`}
                  fill
                  sizes="380px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600/30 to-blue-600/30 flex items-center justify-center">
                  <i className="ri-store-2-line text-4xl text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              <span className="absolute top-2.5 right-2.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                Prévia ao Vivo
              </span>
            </div>

            {/* Conteúdo do Card da Empresa */}
            <div className="p-5 flex flex-col gap-4 relative">
              {/* Logo / Avatar da Empresa */}
              <div className="relative size-16 rounded-2xl overflow-hidden ring-4 ring-[var(--color-surface)] shadow-md shrink-0 -mt-12 bg-[var(--color-input)] flex items-center justify-center">
                {business.logoUrl ? (
                  <Image
                    src={business.logoUrl}
                    alt={business.businessName ?? 'Logo'}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <i className="ri-store-3-line text-2xl text-[var(--color-primary)]" />
                )}
              </div>

              {/* Título & Nicho */}
              <div className="flex flex-col gap-1">
                {principalNiche && (
                  <span className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wide">
                    {principalNiche.nicheName}
                  </span>
                )}
                <h2 className="text-lg font-bold text-[var(--color-title)] leading-snug">
                  {business.businessName ?? 'Nome da sua Empresa'}
                </h2>
              </div>

              {/* Endereço Resumido */}
              {formattedAddress && (
                <p className="text-xs text-[var(--color-muted)] flex items-center gap-1.5">
                  <i className="ri-map-pin-2-line text-[var(--color-primary)]" />
                  {formattedAddress}
                </p>
              )}

              {/* Status do Estabelecimento */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--color-border-default)] text-xs">
                <span className="text-xs text-[var(--color-muted)] font-medium">
                  {niches.length} {niches.length === 1 ? 'nicho' : 'nichos'} cadastrados
                </span>

                <span
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px]',
                    business.isClosed
                      ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger-fg)]'
                      : 'bg-[var(--color-success-bg)] text-[var(--color-success-fg)]',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      business.isClosed ? 'bg-[var(--color-danger)]' : 'bg-[var(--color-success)] animate-pulse',
                    )}
                  />
                  {business.isClosed ? 'Fechado Temporariamente' : 'Ativo no SeuBairro'}
                </span>
              </div>

              {/* Descrição resumida */}
              {business.description && (
                <p className="text-xs text-[var(--color-muted)] line-clamp-3 leading-relaxed">
                  {business.description}
                </p>
              )}

              {/* CTA Ver Perfil Público */}
              {business.slug && (
                <div className="pt-2">
                  <Link href={`/negocio/${business.slug}`} target="_blank" className="w-full">
                    <Button
                      variant="primary"
                      className="w-full shadow-primary font-bold text-xs py-2.5"
                      rightIcon={<i className="ri-external-link-line" />}
                    >
                      Ver Perfil Público da Loja
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}

