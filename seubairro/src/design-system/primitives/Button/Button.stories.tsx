import type { Story } from '@ladle/react'
import { Button } from './Button'

const meta = { title: 'Design System / Primitives / Button' }
export default meta

export const Primary: Story = () => <Button>Salvar alterações</Button>
export const Secondary: Story = () => <Button variant="secondary">Continuar</Button>
export const Outline: Story = () => <Button variant="outline">Cancelar</Button>
export const Ghost: Story = () => <Button variant="ghost">Voltar</Button>
export const Danger: Story = () => <Button variant="danger">Excluir conta</Button>

export const Sizes: Story = () => (
  <div className="flex items-center gap-3">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
)

export const Loading: Story = () => (
  <Button isLoading>Carregando…</Button>
)

export const WithIcons: Story = () => (
  <div className="flex flex-wrap gap-3">
    <Button leftIcon={<i className="ri-add-line" />}>Novo anúncio</Button>
    <Button variant="outline" rightIcon={<i className="ri-arrow-right-line" />}>Continuar</Button>
  </div>
)

export const FullWidth: Story = () => <Button fullWidth>Largura total</Button>

export const Disabled: Story = () => <Button disabled>Desativado</Button>

export const BusinessContext: Story = () => (
  <div data-context="business" className="flex flex-col gap-3">
    <Button>Primário no contexto business (teal)</Button>
    <Button variant="secondary">Secundário</Button>
    <Button variant="outline">Outline</Button>
  </div>
)
