import type { Story } from '@ladle/react'
import { ShellSkeleton } from './ShellSkeleton'
import { ListingCardSkeleton } from '@/design-system/patterns/ListingCard'

const meta = { title: 'Design System / Layout / ShellSkeleton' }
export default meta

export const ClientShell: Story = () => (
  <ShellSkeleton sidebar bottomNav>
    <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </ShellSkeleton>
)

export const BusinessShell: Story = () => <ShellSkeleton sidebar />

export const CardSkeletons: Story = () => (
  <div className="p-6 flex flex-col gap-6 max-w-3xl">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ListingCardSkeleton />
      <ListingCardSkeleton />
    </div>
    <ListingCardSkeleton layout="horizontal" />
  </div>
)
