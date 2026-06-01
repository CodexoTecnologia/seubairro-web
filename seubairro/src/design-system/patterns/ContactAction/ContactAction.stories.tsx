import type { Story } from '@ladle/react'
import { ContactAction } from './ContactAction'

const meta = { title: 'Design System / Patterns / ContactAction' }
export default meta

export const WhatsApp: Story = () => (
  <ContactAction
    channel="whatsapp"
    target="5511999999999"
    message="Olá! Vi seu perfil no SeuBairro"
  />
)

export const Phone: Story = () => <ContactAction channel="phone" target="5511999999999" />

export const Email: Story = () => <ContactAction channel="email" target="contato@exemplo.com" />

export const Share: Story = () => (
  <ContactAction channel="share" target="https://seubairro.com.br/negocio/exemplo" />
)

export const StickyCardExample: Story = () => (
  <div data-context="business" className="max-w-xs flex flex-col gap-2 p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)]">
    <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--color-title)]">
      Falar com a loja
    </h2>
    <ContactAction channel="whatsapp" target="5511999999999" fullWidth />
    <ContactAction channel="phone" target="5511999999999" fullWidth />
    <ContactAction channel="share" target="https://seubairro.com.br" fullWidth />
  </div>
)

export const Sizes: Story = () => (
  <div className="flex flex-col items-start gap-3">
    <ContactAction channel="whatsapp" target="5511999999999" size="sm" />
    <ContactAction channel="whatsapp" target="5511999999999" size="md" />
    <ContactAction channel="whatsapp" target="5511999999999" size="lg" />
  </div>
)
