import type { Story } from '@ladle/react'
import { DistanceBadge } from './DistanceBadge'

const meta = { title: 'Design System / Patterns / DistanceBadge' }
export default meta

export const Metros: Story = () => <DistanceBadge meters={800} />
export const Quilometros: Story = () => <DistanceBadge meters={1240} />
export const MuitoPerto: Story = () => <DistanceBadge meters={120} />
