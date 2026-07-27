'use client'

import type { ReactNode } from 'react'
import * as Menu from '@radix-ui/react-dropdown-menu'
import type { VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils/cn'
import { dropdownMenuContent, dropdownMenuItem } from './DropdownMenu.variants'

/**
 * Menu suspenso acessível baseado em Radix DropdownMenu.
 *
 * Cuida automaticamente de:
 *  - aria-haspopup / aria-expanded no trigger
 *  - navegação por setas, Home/End, Esc (fecha e devolve o foco)
 *  - clique fora fecha
 *  - portal
 */
type RootProps = {
  trigger: ReactNode
  children: ReactNode
  /** Alinhamento do conteúdo em relação ao trigger. Default: `end`. */
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  className?: string
}

const DropdownMenuRoot = ({
  trigger,
  children,
  align = 'end',
  sideOffset = 8,
  className,
}: RootProps) => (
  <Menu.Root modal={false}>
    <Menu.Trigger asChild>{trigger}</Menu.Trigger>
    <Menu.Portal>
      <Menu.Content
        align={align}
        sideOffset={sideOffset}
        loop
        className={cn(dropdownMenuContent(), className)}
      >
        {children}
      </Menu.Content>
    </Menu.Portal>
  </Menu.Root>
)

type ItemProps = Menu.DropdownMenuItemProps &
  VariantProps<typeof dropdownMenuItem> & {
    /** Ícone à esquerda do label. Ignorado quando `asChild`. */
    icon?: ReactNode
  }

const DropdownMenuItem = ({ icon, intent, className, children, asChild, ...props }: ItemProps) => (
  <Menu.Item asChild={asChild} {...props} className={cn(dropdownMenuItem({ intent }), className)}>
    {asChild ? (
      children
    ) : (
      <>
        {icon && (
          <span className="text-lg leading-none" aria-hidden>
            {icon}
          </span>
        )}
        <span className="flex-1">{children}</span>
      </>
    )}
  </Menu.Item>
)

const DropdownMenuSeparator = () => (
  <Menu.Separator className="h-px my-1.5 bg-[var(--color-border-default)]" />
)

const DropdownMenuLabel = ({ children }: { children: ReactNode }) => (
  <Menu.Label className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
    {children}
  </Menu.Label>
)

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Label: DropdownMenuLabel,
})
