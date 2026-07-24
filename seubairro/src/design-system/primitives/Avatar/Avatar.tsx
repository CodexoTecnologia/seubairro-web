'use client'

import Image from 'next/image'
import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'
import { avatarVariants, AVATAR_DIMENSIONS, type AvatarVariants } from './Avatar.variants'

type Props = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> &
  AvatarVariants & {
    /** URL da foto. Ausente ou quebrada cai no `fallback`. */
    src?: string
    /** Descrição acessível obrigatória (ex.: "Foto de Ana Souza"). */
    alt: string
    /** Iniciais exibidas quando não há imagem (ex.: "AS"). */
    fallback: string
  }

export const Avatar = forwardRef<HTMLSpanElement, Props>(
  ({ src, alt, fallback, size, className, ...rest }, ref) => {
    // Guarda a última `src` que falhou no carregamento. Comparar com `src`
    // reativa a imagem automaticamente quando o caller troca a URL, sem efeito.
    const [erroredSrc, setErroredSrc] = useState<string | null>(null)
    const showImage = !!src && erroredSrc !== src
    const dimension = AVATAR_DIMENSIONS[size ?? 'md']

    return (
      <span
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        role={showImage ? undefined : 'img'}
        aria-label={showImage ? undefined : alt}
        {...rest}
      >
        {showImage ? (
          <Image
            src={src}
            alt={alt}
            width={dimension}
            height={dimension}
            className="size-full object-cover"
            onError={() => setErroredSrc(src ?? null)}
          />
        ) : (
          <span aria-hidden>{fallback}</span>
        )}
      </span>
    )
  },
)

Avatar.displayName = 'Avatar'
