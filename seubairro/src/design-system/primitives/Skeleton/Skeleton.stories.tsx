import type { Story } from '@ladle/react'
import { Skeleton } from './Skeleton'

const meta = { title: 'Design System / Primitives / Skeleton' }
export default meta

export const Rect: Story = () => <Skeleton variant="rect" width={240} height={120} />

export const Circle: Story = () => <Skeleton variant="circle" width={64} height={64} />

export const TextLines: Story = () => (
  <div className="max-w-sm">
    <Skeleton variant="text" lines={4} />
  </div>
)

export const ListItem: Story = () => (
  <div className="flex items-center gap-4 max-w-md">
    <Skeleton variant="circle" width={48} height={48} />
    <div className="flex-1 flex flex-col gap-2">
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="40%" />
    </div>
    <Skeleton variant="rect" width={72} height={32} />
  </div>
)
