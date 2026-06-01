'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type Props = {
  lat: number
  lng: number
  name?: string
  zoom?: number
}

/**
 * Leaflet usa imagens dos markers via URL relativo que quebra em bundlers.
 * Esse fix aplica os ícones via CDN do unpkg uma única vez.
 */
const fixDefaultIcon = () => {
  // @ts-expect-error — internal property used by leaflet
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

export const BusinessMapPreviewClient = ({ lat, lng, name, zoom = 16 }: Props) => {
  useEffect(() => {
    fixDefaultIcon()
  }, [])

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className="size-full rounded-[var(--radius-card)] overflow-hidden"
      style={{ minHeight: '240px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        {name && <Popup>{name}</Popup>}
      </Marker>
    </MapContainer>
  )
}
