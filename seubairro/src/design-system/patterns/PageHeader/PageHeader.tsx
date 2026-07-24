import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

type Props = {
  /** Título da página. Renderiza o único `<h1>` da rota. */
  title: string
  /** Subtítulo curto explicando o que a pessoa faz aqui. */
  description?: string
  /** Rótulo acima do título (ex.: nome do negócio, categoria). */
  eyebrow?: ReactNode
  /** Ações primárias da página, alinhadas à direita a partir de `sm`. */
  actions?: ReactNode
  /**
   * Oculta o título visualmente mantendo-o para leitores de tela — para páginas
   * cujo H1 seria redundante com o próprio conteúdo (ex.: feed, busca).
   */
  srOnlyTitle?: boolean
  className?: string
}

/**
 * Cabeçalho padrão de página. Centraliza a escala tipográfica e a semântica do
 * H1 — sem isso cada rota reinventa `text-2xl md:text-3xl font-bold`.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  srOnlyTitle,
  className,
}: Props) {
  if (srOnlyTitle) {
    return <h1 className="sr-only">{title}</h1>
  }

  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex flex-col gap-1 min-w-0">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-page-title md:text-3xl text-[var(--color-title)] text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[var(--color-muted)] text-pretty max-w-prose">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  )
}
