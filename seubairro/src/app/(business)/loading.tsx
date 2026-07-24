import { Skeleton } from '@/design-system/primitives/Skeleton'

export default function BusinessLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      {/* Saudação + link do perfil público */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-2">
          <Skeleton variant="text" width={220} className="h-5" />
          <Skeleton variant="text" width={160} />
        </div>
        <Skeleton variant="rect" width={168} height={44} className="rounded-full" />
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] flex flex-col gap-2"
          >
            <Skeleton variant="text" width={96} />
            <Skeleton variant="text" width={56} className="h-6" />
          </div>
        ))}
      </div>

      {/* Lista de anúncios do negócio */}
      <div className="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <Skeleton variant="text" width={140} />
          <Skeleton variant="rect" width={140} height={40} className="rounded-full" />
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <Skeleton variant="rect" width={48} height={48} className="rounded-lg shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <Skeleton variant="text" width="55%" />
              <Skeleton variant="text" width="30%" />
            </div>
            <Skeleton variant="rect" width={72} height={24} className="rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  )
}
