import type { Story } from '@ladle/react'
import { ListingCard } from './ListingCard'

const meta = { title: 'Design System / Patterns / ListingCard' }
export default meta

const THUMB = 'https://picsum.photos/seed/seubairro/300/225'

const OpenBadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-[var(--color-success-bg)] text-[var(--color-success)]">
    Aberto
  </span>
)

export const VerticalDefault: Story = () => (
  <div className="w-72">
    <ListingCard
      title="Bolo de pote de chocolate"
      price={18.9}
      categoryName="Doces"
      thumbnailUrl={THUMB}
      distanceMeters={800}
      href="#"
    />
  </div>
)

export const VerticalFeatured: Story = () => (
  <div className="w-72">
    <ListingCard
      title="Combo família — 6 salgados"
      price={42}
      categoryName="Salgados"
      thumbnailUrl={THUMB}
      distanceMeters={1240}
      href="#"
      emphasis="featured"
      openSlot={<OpenBadge />}
    />
  </div>
)

export const Horizontal: Story = () => (
  <div className="w-[28rem]">
    <ListingCard
      title="Corte de cabelo masculino"
      price={35}
      categoryName="Serviços"
      thumbnailUrl={THUMB}
      distanceMeters={450}
      href="#"
      layout="horizontal"
      openSlot={<OpenBadge />}
    />
  </div>
)

export const SemImagem: Story = () => (
  <div className="w-72">
    <ListingCard title="Anúncio sem foto" price={9.9} thumbnailUrl={null} distanceMeters={120} href="#" />
  </div>
)
