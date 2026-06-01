import type { Story } from '@ladle/react'
import { ErrorState } from './ErrorState'

const meta = { title: 'Design System / Patterns / ErrorState' }
export default meta

export const Default: Story = () => <ErrorState />

export const WithRetry: Story = () => (
  <ErrorState
    title="Não foi possível carregar o perfil"
    description="O servidor demorou para responder."
    retry={() => alert('Tentando de novo…')}
  />
)

export const Custom: Story = () => (
  <ErrorState
    icon={<i className="ri-wifi-off-line" />}
    title="Sem conexão"
    description="Verifique sua internet e tente novamente."
    retry={() => alert('Reconectando…')}
    retryLabel="Reconectar"
  />
)
