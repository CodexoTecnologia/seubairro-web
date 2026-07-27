'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { useBusinessSetup, usePublicProfileLink } from '@/features/business/hooks'
import { useGreeting } from '@/features/shared/hooks'
import { BusinessSetupModal } from '@/features/business/components'
import { StatCard } from '@/design-system/patterns/StatCard'
import { StatusBadge } from '@/design-system/patterns/StatusBadge'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { ListingService } from '@/lib/api/services/ListingService'
import { CategoryService } from '@/lib/api/services/CategoryService'
import { OrderService } from '@/lib/api/services/OrderService'
import {
  OrderStatusEnum,
  getOrderStatusLabel,
  getOrderStatusTone,
} from '@/lib/api/enums/OrderStatusEnum'
import type { OrderResponse } from '@/lib/api/dtos/Response/index'

type Listing = {
  id: string
  title: string
  categoryName: string
  price: string
  isActive: boolean
}

const normalize = <T,>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return Array.isArray((raw as { data: unknown }).data)
      ? ((raw as { data: T[] }).data ?? [])
      : []
  }
  return []
}

function formatCurrency(value: number, currency = 'BRL') {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value)
  } catch {
    return `R$ ${value.toFixed(2)}`
  }
}

function formatShortDate(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function BusinessDashboard() {
  const { user } = useAuthContext()
  const greeting = useGreeting()
  const { loading: setupLoading, business, step } = useBusinessSetup()
  const { href: publicHref, slug } = usePublicProfileLink()

  const [listings, setListings] = useState<Listing[]>([])
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  const isLoading = setupLoading || dataLoading

  useEffect(() => {
    if (setupLoading) return
    if (!business || step !== null) {
      setDataLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const [catsRaw, listingsRaw, ordersPage] = await Promise.all([
          CategoryService.getAll(),
          ListingService.getByBusiness(business.id),
          OrderService.getByBusiness(business.id, { pageSize: 50 }).catch(() => null),
        ])
        if (cancelled) return

        const cats = normalize<{ id: string; name: string }>(catsRaw)
        const catMap = Object.fromEntries(cats.map((c) => [c.id, c.name]))
        const raws = normalize<{
          id: string
          title?: string
          price: number
          isActive: boolean
          listingCategoryId?: string
          categoryId?: string
        }>(listingsRaw)
        setListings(
          raws.map((l) => ({
            id: l.id,
            title: l.title || 'Anúncio sem título',
            categoryName: catMap[l.listingCategoryId ?? l.categoryId ?? ''] ?? 'Geral',
            price: formatCurrency(l.price),
            isActive: l.isActive,
          })),
        )
        setOrders(
          (ordersPage?.items ?? [])
            .slice()
            .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
        )
      } catch {
        // Sem dados o dashboard renderiza os cards vazios.
      } finally {
        if (!cancelled) setDataLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [setupLoading, business, step])

  const activeListings = listings.filter((l) => l.isActive)
  const pendingOrders = orders.filter(
    (o) => o.status === OrderStatusEnum.Pending || o.status === OrderStatusEnum.AwaitingPayment,
  ).length
  const completedOrders = orders.filter((o) => o.status === OrderStatusEnum.Completed).length
  const recentOrders = orders.slice(0, 5)

  const rating =
    business?.averageRating !== undefined && business.averageRating > 0
      ? business.averageRating.toLocaleString('pt-BR', {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : null
  const reviewCount = business?.reviewCount ?? 0

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <BusinessSetupModal step={step} />

      {/* Cabeçalho do Dashboard com Boas-Vindas e Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border-default)]">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)] tracking-tight">
            {greeting}{business?.businessName || business?.legalName || user?.name ? `, ${business?.businessName || business?.legalName || user?.name}` : ''}
          </h1>
          <p className="text-xs md:text-sm text-[var(--color-muted)]">
            Aqui está o resumo do desempenho e pedidos do seu negócio hoje.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {slug && (
            <Link href={publicHref} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm" leftIcon={<i className="ri-eye-line text-sm" />}>
                Ver Perfil Público
              </Button>
            </Link>
          )}
          <Link href="/criar-anuncio">
            <Button size="sm" leftIcon={<i className="ri-add-circle-fill text-sm" />}>
              Criar Anúncio
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards de Métricas / KPI */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={88} className="rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Anúncios ativos"
            value={String(activeListings.length)}
            hint={`de ${listings.length} no total`}
            tone="primary"
            icon={<i className="ri-store-2-line" />}
          />
          <StatCard
            label="Pedidos pendentes"
            value={String(pendingOrders)}
            hint={pendingOrders > 0 ? 'aguardando sua ação' : 'nenhum em aberto'}
            tone={pendingOrders > 0 ? 'warning' : 'neutral'}
            icon={<i className="ri-time-line" />}
          />
          <StatCard
            label="Pedidos concluídos"
            value={String(completedOrders)}
            tone="success"
            icon={<i className="ri-check-double-line" />}
          />
          <StatCard
            label="Avaliação média"
            value={rating ?? '—'}
            hint={
              reviewCount > 0
                ? `${reviewCount} ${reviewCount === 1 ? 'avaliação' : 'avaliações'}`
                : 'sem avaliações ainda'
            }
            tone="warning"
            icon={<i className="ri-star-line text-amber-400" />}
          />
        </div>
      )}



      {/* Seção 2 Colunas: Pedidos Recentes & Seus Anúncios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Pedidos recentes */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-[var(--color-title)] uppercase tracking-wide flex items-center gap-2">
              <i className="ri-shopping-bag-3-line text-[var(--color-primary)] text-sm" />
              Pedidos recentes
            </h2>
            <Link
              href="/pedidos"
              className="text-xs text-[var(--color-primary)] hover:underline font-semibold"
            >
              Ver todos
            </Link>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-default)] divide-y divide-[var(--color-border-default)] overflow-hidden shadow-2xs">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="30%" />
                  </div>
                  <Skeleton variant="rect" width={72} height={24} className="rounded-lg" />
                </div>
              ))
            ) : recentOrders.length === 0 ? (
              <EmptyState
                icon={<i className="ri-inbox-line text-3xl" aria-hidden />}
                title="Nenhum pedido ainda"
                description="Quando algum cliente fizer um pedido, ele aparecerá aqui para você gerenciar."
              />
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href="/pedidos"
                  className="flex items-center gap-3 p-3.5 hover:bg-[var(--color-page)] transition-colors"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <strong className="text-xs font-semibold text-[var(--color-title)] truncate">
                      Pedido #{order.id}
                      {order.customerName ? ` — ${order.customerName}` : ''}
                    </strong>
                    <span className="text-[11px] text-[var(--color-muted)]">
                      {formatShortDate(order.createdAt)} ·{' '}
                      <span data-numeric className="font-semibold text-[var(--color-title)]">
                        {formatCurrency(order.totalValue, order.currencyCode)}
                      </span>
                    </span>
                  </div>
                  <StatusBadge tone={getOrderStatusTone(order.status)}>
                    {getOrderStatusLabel(order.status)}
                  </StatusBadge>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Anúncios */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-[var(--color-title)] uppercase tracking-wide flex items-center gap-2">
              <i className="ri-store-2-line text-[var(--color-primary)] text-sm" />
              Seus anúncios
            </h2>
            <Link
              href="/listar-anuncio"
              className="text-xs text-[var(--color-primary)] hover:underline font-semibold"
            >
              Ver todos
            </Link>
          </div>
          <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-default)] divide-y divide-[var(--color-border-default)] overflow-hidden shadow-2xs">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="30%" />
                  </div>
                  <Skeleton variant="rect" width={64} height={24} className="rounded-lg" />
                </div>
              ))
            ) : listings.length === 0 ? (
              <EmptyState
                icon={<i className="ri-store-2-line text-3xl" aria-hidden />}
                title="Você ainda não tem anúncios"
                description="Crie seu primeiro produto ou serviço para aparecer nas buscas da sua região."
                action={
                  <Link href="/criar-anuncio">
                    <Button size="sm">Criar primeiro anúncio</Button>
                  </Link>
                }
              />
            ) : (
              listings.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={`/anuncio/${item.id}`}
                  className="flex items-center gap-3 p-3.5 hover:bg-[var(--color-page)] transition-colors"
                >
                  <div className="flex flex-col flex-1 min-w-0">
                    <strong className="text-xs font-semibold text-[var(--color-title)] truncate">
                      {item.title}
                    </strong>
                    <span className="text-[11px] text-[var(--color-muted)]">{item.categoryName}</span>
                  </div>
                  <span data-numeric className="text-xs font-bold text-[var(--color-primary)]">
                    {item.price}
                  </span>
                  <StatusBadge tone={item.isActive ? 'success' : 'neutral'}>
                    {item.isActive ? 'Ativo' : 'Inativo'}
                  </StatusBadge>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
