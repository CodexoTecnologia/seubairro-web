import { cva, type VariantProps } from 'class-variance-authority'

export const avatarVariants = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center overflow-hidden',
    'rounded-full select-none',
    'bg-[var(--color-primary)] text-white font-semibold uppercase leading-none',
  ],
  {
    variants: {
      size: {
        sm: 'size-8 text-xs',
        md: 'size-10 text-sm',
        lg: 'size-14 text-base',
        xl: 'size-20 text-2xl',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export type AvatarVariants = VariantProps<typeof avatarVariants>

/**
 * Dimensões em pixels por tamanho — espelham as classes `size-*` do CVA.
 * `next/image` exige `width`/`height` numéricos; mantemos o mapa sincronizado
 * com as variantes para a imagem preencher exatamente o container.
 */
export const AVATAR_DIMENSIONS: Record<NonNullable<AvatarVariants['size']>, number> = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
}
