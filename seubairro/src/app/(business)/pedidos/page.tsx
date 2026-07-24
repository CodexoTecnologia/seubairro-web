'use client'

import { useState } from 'react'
import { usePublicProfileLink, useBusinessOrders } from '@/features/business/hooks'
import { OrderManageCard } from '@/features/business/components'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { ErrorState } from '@/design-system/patterns/ErrorState'
import { FilterChips } from '@/design-system/patterns/FilterChips'
import { PageHeader } from '@/design-system/patterns/PageHeader'
import { OrderStatusEnum, getOrderStatusLabel } from '@/lib/api/enums/OrderStatusEnum'

/** Status oferecidos como filtro, na ordem do fluxo de atendimento. */
const FILTERABLE_STATUSES: OrderStatusEnum[] = [
  OrderStatusEnum.Pending,
  OrderStatusEnum.Accepted,
  OrderStatusEnum.InProgress,
  OrderStatusEnum.Ready,
  OrderStatusEnum.Completed,
  OrderStatusEnum.Rejected,
  OrderStatusEnum.Cancelled,
]

const FILTER_ITEMS = FILTERABLE_STATUSES.map((status) => ({
  value: status,
  label: getOrderStatusLabel(status),
}))

export default function PedidosPage() {
  const { businessId, status: profileStatus } = usePublicProfileLink()
  const [statusFilter, setStatusFilter] = useState<OrderStatusEnum | undefined>(undefined)
  const { orders, isLoading, error, updateStatus } = useBusinessOrders(businessId, statusFilter)

  const loading =
    profileStatus === 'idle' || profileStatus === 'loading' || (Boolean(businessId) && isLoading)

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <PageHeader title="Pedidos" description="Acompanhe e gerencie os pedidos do seu negócio." />

      {profileStatus === 'error' && <ErrorState title="Não foi possível identificar seu negócio" />}

      {profileStatus === 'ready' && !businessId && (
        <EmptyState
          icon={<i className="ri-store-line" />}
          title="Nenhum negócio encontrado"
          description="Crie seu negócio para começar a receber pedidos."
        />
      )}

      {businessId && (
        <FilterChips
          items={FILTER_ITEMS}
          selected={statusFilter ? [statusFilter] : []}
          onChange={(selected) => setStatusFilter(selected[0] as OrderStatusEnum | undefined)}
          multi={false}
          ariaLabel="Filtrar pedidos por status"
        />
      )}

      {error && <ErrorState title="Erro ao carregar pedidos" description={error.message} />}

      {loading && (
        <div className="flex flex-col gap-4">
          <Skeleton variant="rect" height={96} />
          <Skeleton variant="rect" height={96} />
          <Skeleton variant="rect" height={96} />
        </div>
      )}

      {!loading && !error && businessId && orders.length === 0 && (
        <EmptyState
          icon={<i className="ri-inbox-line" />}
          title={statusFilter ? 'Nenhum pedido neste status' : 'Nenhum pedido por enquanto'}
          description={
            statusFilter
              ? 'Ajuste o filtro para ver os outros pedidos.'
              : 'Quando alguém comprar um anúncio seu, o pedido aparece aqui.'
          }
        />
      )}

      {!loading && !error && orders.length > 0 && (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id}>
              <OrderManageCard order={order} onUpdateStatus={updateStatus} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
