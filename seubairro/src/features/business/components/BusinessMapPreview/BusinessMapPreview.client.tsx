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

const businessPinIcon = L.divIcon({
  className: 'sb-map-business-pin',
  html: `
    <div style="position:relative;display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:#ffffff;border:2.5px solid var(--color-primary);box-shadow:0 4px 12px rgba(0,0,0,0.25);">
      <img src="/icon.svg" alt="SeuBairro Logo" style="width:26px;height:26px;object-fit:contain;" />
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
  popupAnchor: [0, -20],
})

export const BusinessMapPreviewClient = ({ lat, lng, name, zoom = 16 }: Props) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={false}
      className="size-full rounded-[var(--radius-card)] overflow-hidden isolate z-0"
      style={{ minHeight: '240px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={businessPinIcon}>
        {name && <Popup>{name}</Popup>}
      </Marker>
    </MapContainer>
  )
}
