import dynamic from 'next/dynamic'
import { Skeleton } from '@/design-system/primitives/Skeleton'

type Props = {
  lat: number
  lng: number
  name?: string
  zoom?: number
}

/**
 * Wrapper público do mapa.
 *
 * Leaflet usa APIs do browser (window, document, ResizeObserver) e quebra em SSR,
 * então o componente real é carregado dinamicamente com `ssr: false`. O skeleton
 * fica no lugar até o JS do client baixar.
 */
const BusinessMapPreviewClient = dynamic(
  () =>
    import('./BusinessMapPreview.client').then((m) => m.BusinessMapPreviewClient),
  {
    ssr: false,
    loading: () => <Skeleton variant="rect" className="size-full min-h-[240px]" />,
  },
)

export const BusinessMapPreview = (props: Props) => <BusinessMapPreviewClient {...props} />
