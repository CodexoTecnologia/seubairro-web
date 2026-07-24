'use client'

import { forwardRef, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils/cn'

/**
 * Slide-over (Drawer) acessível baseado em Radix Dialog. Desliza a partir da
 * lateral direita sobre um overlay escurecido.
 *
 * Cuida automaticamente de foco (trap + restore), ESC, click no overlay,
 * `role=dialog` + `aria-modal` + `aria-labelledby` e portal. A animação usa os
 * keyframes `drawer-*` definidos em `app/global.css`.
 *
 * Layout: cabeçalho fixo (título + fechar), corpo rolável e rodapé opcional
 * fixo (ideal para ações como "Limpar" / "Aplicar").
 */
type Props = {
  /** Elemento que abre o drawer. Omitido quando controlado externamente. */
  trigger?: ReactNode
  title: string
  description?: string
  children: ReactNode
  /** Ações fixas no rodapé (ex.: botões Limpar/Aplicar). */
  footer?: ReactNode
  /** Largura máxima do painel. Default: `md` (28rem). */
  size?: 'sm' | 'md' | 'lg'
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const sizeMap: Record<NonNullable<Props['size']>, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
}

const DrawerRoot = ({
  trigger,
  title,
  description,
  children,
  footer,
  size = 'md',
  open,
  onOpenChange,
  className,
}: Props) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
    <Dialog.Portal>
      <Dialog.Overlay
        className={cn(
          'fixed inset-0 z-40 bg-black/40',
          'data-[state=open]:animate-[drawer-overlay-in_200ms_ease-out]',
        )}
      />
      <Dialog.Content
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col',
          sizeMap[size],
          'bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] focus:outline-none',
          'data-[state=open]:animate-[drawer-in-right_240ms_ease-out]',
          className,
        )}
      >
        <header className="flex items-start justify-between gap-4 border-b border-[var(--color-border-default)] px-6 py-4">
          <div className="min-w-0">
            <Dialog.Title className="text-lg font-semibold text-[var(--color-title)]">
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description className="mt-0.5 text-sm text-[var(--color-muted)]">
                {description}
              </Dialog.Description>
            )}
          </div>
          <Dialog.Close
            aria-label="Fechar"
            className="-mr-1 size-8 shrink-0 inline-flex items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-page)] hover:text-[var(--color-title)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
          >
            <i className="ri-close-line text-xl" />
          </Dialog.Close>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <div className="flex gap-3 border-t border-[var(--color-border-default)] px-6 py-4">
            {footer}
          </div>
        )}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

/** Atalho para fechar o drawer de dentro do conteúdo. */
const DrawerClose = forwardRef<HTMLButtonElement, Dialog.DialogCloseProps>((props, ref) => (
  <Dialog.Close ref={ref} {...props} />
))
DrawerClose.displayName = 'Drawer.Close'

export const Drawer = Object.assign(DrawerRoot, { Close: DrawerClose })
