import dynamic from 'next/dynamic'
import { Skeleton } from '@/design-system/primitives/Skeleton'

type Props = {
  lat: number
  lng: number
  name?: string
  zoom?: number
}

const BusinessMapPreviewClient = dynamic(
  () =>
    import('./BusinessMapPreview.client').then((m) => m.BusinessMapPreviewClient),
  {
    ssr: false,
    loading: () => <Skeleton variant="rect" className="size-full min-h-[240px]" />,
  },
)

export const BusinessMapPreview = (props: Props) => <BusinessMapPreviewClient {...props} />
