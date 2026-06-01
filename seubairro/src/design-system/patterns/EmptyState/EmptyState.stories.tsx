import type { Story } from '@ladle/react'
import { EmptyState } from './EmptyState'
import { Button } from '@/design-system/primitives/Button'

const meta = { title: 'Design System / Patterns / EmptyState' }
export default meta

export const Minimal: Story = () => (
  <EmptyState title="Nenhum resultado encontrado" />
)

export const WithIconAndDescription: Story = () => (
  <EmptyState
    icon={<i className="ri-search-2-line" />}
    title="Nenhum anúncio encontrado"
    description="Tente ajustar os filtros ou pesquisar por outro termo."
  />
)

export const WithAction: Story = () => (
  <EmptyState
    icon={<i className="ri-store-2-line" />}
    title="Você ainda não tem anúncios"
    description="Crie seu primeiro produto ou serviço para aparecer nas buscas."
    action={<Button>Criar primeiro anúncio</Button>}
  />
)
