import type { Story } from '@ladle/react'
import { StatusBadge } from './StatusBadge'

const meta = { title: 'Design System / Patterns / StatusBadge' }
export default meta

export const Tons: Story = () => (
  <div className="flex flex-wrap items-center gap-2">
    <StatusBadge tone="neutral">Cancelado</StatusBadge>
    <StatusBadge tone="info">Em preparo</StatusBadge>
    <StatusBadge tone="warning">Pendente</StatusBadge>
    <StatusBadge tone="success">Concluído</StatusBadge>
    <StatusBadge tone="danger">Recusado</StatusBadge>
  </div>
)

export const ComIcone: Story = () => (
  <div className="flex flex-wrap items-center gap-2">
    <StatusBadge tone="warning" icon={<i className="ri-time-line" />}>
      Aguardando pagamento
    </StatusBadge>
    <StatusBadge tone="success" icon={<i className="ri-check-line" />}>
      Aprovado
    </StatusBadge>
  </div>
)

export const StatusDePedido: Story = () => (
  <div className="flex flex-wrap items-center gap-2">
    <StatusBadge tone="warning">Aguardando pagamento</StatusBadge>
    <StatusBadge tone="warning">Pendente</StatusBadge>
    <StatusBadge tone="info">Aceito</StatusBadge>
    <StatusBadge tone="info">Em preparo</StatusBadge>
    <StatusBadge tone="info">Pronto</StatusBadge>
    <StatusBadge tone="success">Concluído</StatusBadge>
    <StatusBadge tone="danger">Recusado</StatusBadge>
    <StatusBadge tone="neutral">Cancelado</StatusBadge>
  </div>
)
