import type { Story } from '@ladle/react'
import { Avatar } from './Avatar'

const meta = { title: 'Design System / Primitives / Avatar' }
export default meta

const SAMPLE = 'https://i.pravatar.cc/160?img=12'

export const Sizes: Story = () => (
  <div className="flex items-end gap-4">
    <Avatar size="sm" src={SAMPLE} alt="Foto de Ana Souza" fallback="AS" />
    <Avatar size="md" src={SAMPLE} alt="Foto de Ana Souza" fallback="AS" />
    <Avatar size="lg" src={SAMPLE} alt="Foto de Ana Souza" fallback="AS" />
    <Avatar size="xl" src={SAMPLE} alt="Foto de Ana Souza" fallback="AS" />
  </div>
)

export const WithImage: Story = () => (
  <Avatar size="xl" src={SAMPLE} alt="Foto de Ana Souza" fallback="AS" />
)

export const BrokenImage: Story = () => (
  <Avatar
    size="xl"
    src="https://invalid.seubairro.local/none.png"
    alt="Foto de Bruno Lima"
    fallback="BL"
  />
)

export const FallbackOnly: Story = () => (
  <div className="flex items-end gap-4">
    <Avatar size="sm" alt="Foto de Carla Dias" fallback="CD" />
    <Avatar size="md" alt="Foto de Carla Dias" fallback="CD" />
    <Avatar size="lg" alt="Foto de Carla Dias" fallback="CD" />
    <Avatar size="xl" alt="Foto de Carla Dias" fallback="CD" />
  </div>
)
