/**
 * Mock de `next/image` exclusivo do Ladle.
 *
 * Fora do runtime do Next, o loader padrão de `next/image` aponta para
 * `/_next/image`, que não existe no Vite do Ladle — toda imagem 404aria e cairia
 * no fallback. Este mock renderiza um `<img>` simples com a `src` original, para
 * que as stories demonstrem o estado "com imagem" de verdade.
 *
 * Aliasado apenas no Ladle via `.ladle/vite.config.ts`. O app de produção
 * continua usando o `next/image` real.
 */
import type { ImgHTMLAttributes } from 'react'

type NextImageMockProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src?: string
  fill?: boolean
}

const NEXT_ONLY_PROPS = [
  'priority',
  'quality',
  'unoptimized',
  'loader',
  'placeholder',
  'blurDataURL',
  'sizes',
  'loading',
  'fetchPriority',
] as const

export default function NextImageMock({ fill, style, ...props }: NextImageMockProps) {
  const imgProps = { ...props } as Record<string, unknown>
  for (const key of NEXT_ONLY_PROPS) delete imgProps[key]

  const fillStyle = fill
    ? ({ position: 'absolute', inset: 0, width: '100%', height: '100%' } as const)
    : undefined

  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  return <img {...(imgProps as ImgHTMLAttributes<HTMLImageElement>)} style={{ ...fillStyle, ...style }} />
}
