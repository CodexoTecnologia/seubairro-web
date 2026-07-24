import dynamic from 'next/dynamic'
import type { MapPoint } from './ListingsMap.client'

type Props = {
  points: MapPoint[]
  userCoords?: { lat: number; lng: number } | null
  interactive?: boolean
}

// Leaflet toca `window` → carrega só no cliente (sem SSR).
const ListingsMapClient = dynamic(
  () => import('./ListingsMap.client').then((m) => m.ListingsMapClient),
  {
    ssr: false,
    loading: () => (
      <div className="size-full min-h-[240px] animate-pulse bg-[var(--color-page)] rounded-[var(--radius-card)]" />
    ),
  },
)

export function ListingsMap(props: Props) {
  return <ListingsMapClient {...props} />
}

export type { MapPoint }
