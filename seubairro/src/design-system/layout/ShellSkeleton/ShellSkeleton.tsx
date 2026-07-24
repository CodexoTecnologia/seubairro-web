import type { ReactNode } from 'react'
import { Skeleton } from '@/design-system/primitives/Skeleton'

type Props = {
  /** Renderiza a coluna lateral (desktop) com a anatomia da sidebar real. */
  sidebar?: boolean
  /** Renderiza a barra inferior (mobile) com a anatomia do bottom nav real. */
  bottomNav?: boolean
  /** Skeleton do conteúdo da página. Default: título + grade de blocos. */
  children?: ReactNode
}

/**
 * Esqueleto do shell autenticado (navbar + sidebar/bottom nav + conteúdo),
 * com a mesma geometria de PageShell/DashboardShell. Usado como fallback
 * do AuthGuard enquanto sessão e roles carregam.
 */
export const ShellSkeleton = ({ sidebar, bottomNav, children }: Props) => (
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    className="min-h-dvh flex flex-col bg-[var(--color-page)]"
  >
    <span className="sr-only">Carregando…</span>

    {/* Navbar: logo + busca + chip do usuário */}
    <div className="h-[var(--nav-height)] shrink-0 bg-[var(--color-surface)] border-b border-[var(--color-border-default)]">
      <div className="h-full w-full px-4 md:px-8 flex items-center justify-between gap-4">
        <Skeleton variant="circle" width={36} height={36} />
        <Skeleton variant="text" width={88} className="hidden sm:block" />
        <Skeleton
          variant="rect"
          height={36}
          className="hidden md:block flex-1 max-w-[500px] rounded-full"
        />
        <Skeleton variant="rect" width={120} height={40} className="ml-auto rounded-full" />
      </div>
    </div>

    <div className="flex flex-1 w-full">
      {sidebar && (
        <div className="hidden md:flex w-[260px] shrink-0 flex-col gap-4 p-5 bg-[var(--color-surface)] border-r border-[var(--color-border-default)]">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width={96} />
            <Skeleton variant="rect" width={72} height={22} className="rounded-full" />
          </div>
          <div className="flex flex-col gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="rect" height={44} className="rounded-lg" />
            ))}
          </div>
          <Skeleton variant="rect" height={64} className="mt-auto rounded-lg" />
        </div>
      )}

      <main
        className={
          bottomNav
            ? 'flex-1 min-w-0 p-4 md:p-6 md:pb-6 pb-[calc(env(safe-area-inset-bottom)+5rem)]'
            : 'flex-1 min-w-0 p-4 md:p-6'
        }
      >
        {children ?? (
          <div className="flex flex-col gap-4 max-w-6xl mx-auto w-full">
            <Skeleton variant="text" width="35%" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="rect" height={220} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>

    {bottomNav && (
      <div
        className="md:hidden fixed bottom-0 inset-x-0 z-30 h-16 border-t border-[var(--color-border-default)] bg-[var(--color-surface)] flex items-center justify-around"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <Skeleton variant="circle" width={22} height={22} />
            <Skeleton variant="text" width={40} />
          </div>
        ))}
      </div>
    )}
  </div>
)
