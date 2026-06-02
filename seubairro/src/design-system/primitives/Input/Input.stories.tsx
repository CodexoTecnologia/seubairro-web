import type { Story } from '@ladle/react'
import { Input } from './Input'

const meta = { title: 'Design System / Primitives / Input' }
export default meta

export const Default: Story = () => (
  <div className="max-w-sm">
    <Input label="Email" type="email" placeholder="seu@email.com" />
  </div>
)

export const WithLeftIcon: Story = () => (
  <div className="max-w-sm">
    <Input
      label="Email"
      type="email"
      placeholder="seu@email.com"
      leftIcon={<i className="ri-mail-line" />}
    />
  </div>
)

export const WithError: Story = () => (
  <div className="max-w-sm">
    <Input
      label="Email"
      type="email"
      defaultValue="invalid"
      leftIcon={<i className="ri-mail-line" />}
      error="Email inválido"
    />
  </div>
)

export const WithHint: Story = () => (
  <div className="max-w-sm">
    <Input
      label="Senha"
      type="password"
      hint="Mínimo 8 caracteres"
      leftIcon={<i className="ri-lock-line" />}
    />
  </div>
)

export const WithRightElement: Story = () => (
  <div className="max-w-sm">
    <Input
      label="Senha"
      type="password"
      placeholder="••••••••"
      leftIcon={<i className="ri-lock-line" />}
      rightElement={
        <button type="button" className="text-[var(--color-muted)] hover:text-[var(--color-body)]">
          <i className="ri-eye-line" />
        </button>
      }
    />
  </div>
)

export const Sizes: Story = () => (
  <div className="max-w-sm flex flex-col gap-3">
    <Input size="sm" label="Small" placeholder="h-8" />
    <Input size="md" label="Medium (default)" placeholder="h-10" />
    <Input size="lg" label="Large" placeholder="h-12" />
  </div>
)

export const Disabled: Story = () => (
  <div className="max-w-sm">
    <Input label="Read-only" defaultValue="usuario@exemplo.com" disabled />
  </div>
)
