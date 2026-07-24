import type { Story } from '@ladle/react'
import { StatCard } from './StatCard'

const meta = { title: 'Design System / Patterns / StatCard' }
export default meta

export const KpiRow: Story = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
    <StatCard
      label="Anúncios ativos"
      value="8"
      hint="de 12 no total"
      tone="primary"
      icon={<i className="ri-store-2-line" />}
    />
    <StatCard
      label="Pedidos pendentes"
      value="3"
      hint="aguardando sua ação"
      tone="warning"
      icon={<i className="ri-time-line" />}
    />
    <StatCard
      label="Pedidos concluídos"
      value="27"
      tone="success"
      icon={<i className="ri-check-double-line" />}
    />
    <StatCard
      label="Avaliação média"
      value="4,8"
      hint="32 avaliações"
      icon={<i className="ri-star-line" />}
    />
  </div>
)

export const SemDados: Story = () => (
  <div className="max-w-56">
    <StatCard label="Avaliação média" value="—" hint="sem avaliações ainda" icon={<i className="ri-star-line" />} />
  </div>
)
