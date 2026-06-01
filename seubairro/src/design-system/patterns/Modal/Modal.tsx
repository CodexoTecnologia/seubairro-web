'use client'

import { forwardRef, type ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '@/lib/utils/cn'

/**
 * Modal acessível baseado em Radix Dialog.
 *
 * Cuida automaticamente de:
 *  - foco (trap + restore)
 *  - tecla ESC + click no overlay
 *  - role=dialog + aria-modal + aria-labelledby/describedby
 *  - portal
 *
 * Você só estiliza com Tailwind / tokens.
 *
 * Uso típico:
 *   <Modal
 *     trigger={<Button>Abrir</Button>}
 *     title="Confirmar exclusão"
 *     description="Esta ação não pode ser desfeita."
 *     footer={
 *       <>
 *         <Modal.Close asChild><Button variant="outline">Cancelar</Button></Modal.Close>
 *         <Button variant="danger" onClick={...}>Excluir</Button>
 *       </>
 *     }
 *   >
 *     <p>Tem certeza?</p>
 *   </Modal>
 */
type Props = {
  trigger: ReactNode
  title: string
  description?: string
  children?: ReactNode
  footer?: ReactNode
  /** Largura máxima do conteúdo. Default: `sm` (28rem). */
  size?: 'sm' | 'md' | 'lg'
  /** Permite controle externo. Quando omitido, o Trigger gerencia. */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

const sizeMap: Record<NonNullable<Props['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

const ModalRoot = ({
  trigger,
  title,
  description,
  children,
  footer,
  size = 'sm',
  open,
  onOpenChange,
  className,
}: Props) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
          'w-[calc(100vw-2rem)]',
          sizeMap[size],
          'rounded-[var(--radius-card)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-elevated)]',
          'focus:outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          className,
        )}
      >
        <Dialog.Title className="text-lg font-semibold text-[var(--color-title)]">
          {title}
        </Dialog.Title>
        {description && (
          <Dialog.Description className="mt-1 text-sm text-[var(--color-muted)]">
            {description}
          </Dialog.Description>
        )}
        {children && <div className="mt-4 text-sm text-[var(--color-body)]">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
        <Dialog.Close
          aria-label="Fechar"
          className="absolute right-4 top-4 size-8 inline-flex items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-page)] hover:text-[var(--color-title)] transition-colors"
        >
          <i className="ri-close-line text-lg" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

/** Atalho para fechar o modal de dentro do conteúdo (ex.: botão Cancelar no footer). */
const ModalClose = forwardRef<HTMLButtonElement, Dialog.DialogCloseProps>((props, ref) => (
  <Dialog.Close ref={ref} {...props} />
))
ModalClose.displayName = 'Modal.Close'

export const Modal = Object.assign(ModalRoot, { Close: ModalClose })
