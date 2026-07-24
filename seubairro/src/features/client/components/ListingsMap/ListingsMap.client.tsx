'use client'

import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export type MapPoint = {
  id: string
  lat: number
  lng: number
  title: string
  priceLabel?: string
  onSelect?: () => void
}

type Props = {
  points: MapPoint[]
  userCoords?: { lat: number; lng: number } | null
  interactive?: boolean
}

/** Vários anúncios no mesmo endereço (ex.: mesma loja) viram um pin agrupado. */
type PinGroup = {
  key: string
  lat: number
  lng: number
  items: MapPoint[]
}

// Centro aproximado do Brasil — fallback quando não há pontos nem localização.
const BRAZIL_CENTER: [number, number] = [-14.235, -51.925]

/** Pin da loja com a Logo oficial do SeuBairro. Se count > 1, exibe o selo com a quantidade. */
function makePinIcon(count: number) {
  const badge =
    count > 1
      ? `<span style="position:absolute;top:-5px;right:-7px;min-width:18px;height:18px;padding:0 4px;border-radius:9999px;background:#ef4444;color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 4px rgba(0,0,0,0.2)">${count}</span>`
      : ''
  return L.divIcon({
    className: 'sb-map-pin',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:50%;background:#ffffff;border:2.5px solid var(--color-primary);box-shadow:0 4px 12px rgba(0,0,0,0.25);transition:transform 0.2s ease;">
        <img src="/icon.svg" alt="SeuBairro Logo" style="width:24px;height:24px;object-fit:contain;" />
        ${badge}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  })
}

/** Ícone de localização do usuário refinado com anel de pulso e efeito radar. */
const userIcon = L.divIcon({
  className: 'sb-map-user-pin',
  html: `
    <div style="position:relative;width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:rgba(37,99,235,0.3);animation:ping 2s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="position:relative;width:20px;height:20px;border-radius:50%;background:#2563eb;border:3px solid #ffffff;box-shadow:0 0 12px rgba(37,99,235,0.6);display:flex;align-items:center;justify-content:center;">
        <div style="width:6px;height:6px;border-radius:50%;background:#ffffff;"></div>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
})

/** Agrupa anúncios que caem na mesma coordenada (mesmo endereço da empresa). */
function groupByCoords(points: MapPoint[]): PinGroup[] {
  const groups = new Map<string, PinGroup>()
  for (const p of points) {
    const key = `${p.lat.toFixed(6)},${p.lng.toFixed(6)}`
    const existing = groups.get(key)
    if (existing) {
      existing.items.push(p)
    } else {
      groups.set(key, { key, lat: p.lat, lng: p.lng, items: [p] })
    }
  }
  return Array.from(groups.values())
}

/** Ajusta o enquadramento para conter todos os pontos (e o usuário). */
function FitBounds({
  groups,
  userCoords,
}: {
  groups: PinGroup[]
  userCoords?: { lat: number; lng: number } | null
}) {
  const map = useMap()
  useEffect(() => {
    // Recalcula o tamanho do container (a altura vem da coluna de anúncios).
    map.invalidateSize()
    const coords: [number, number][] = groups.map((g) => [g.lat, g.lng])
    if (userCoords) coords.push([userCoords.lat, userCoords.lng])
    if (coords.length === 0) return
    if (coords.length === 1) {
      map.setView(coords[0], 15)
      return
    }
    map.fitBounds(L.latLngBounds(coords), { padding: [40, 40], maxZoom: 16 })
  }, [map, groups, userCoords])
  return null
}

export function ListingsMapClient({ points, userCoords, interactive = false }: Props) {
  const groups = useMemo(() => groupByCoords(points), [points])

  const center = useMemo<[number, number]>(() => {
    if (userCoords) return [userCoords.lat, userCoords.lng]
    if (groups[0]) return [groups[0].lat, groups[0].lng]
    return BRAZIL_CENTER
  }, [userCoords, groups])

  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      zoomControl={interactive}
      keyboard={interactive}
      // `isolate z-0` cria um stacking context próprio: os z-index internos do
      // Leaflet (até 1000) ficam contidos e não cobrem navbar/drawer/overlays.
      className="size-full isolate z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userCoords && (
        <Marker position={[userCoords.lat, userCoords.lng]} icon={userIcon}>
          <Tooltip direction="top">Você está aqui</Tooltip>
        </Marker>
      )}

      {groups.map((g) => {
        const single = g.items.length === 1 ? g.items[0] : null
        return (
          <Marker
            key={g.key}
            position={[g.lat, g.lng]}
            icon={makePinIcon(g.items.length)}
            eventHandlers={single?.onSelect ? { click: () => single.onSelect?.() } : undefined}
          >
            {single ? (
              <Tooltip direction="top">
                <strong>{single.title}</strong>
                {single.priceLabel ? ` · ${single.priceLabel}` : ''}
              </Tooltip>
            ) : (
              <Popup>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 180 }}>
                  <strong>{g.items.length} anúncios neste endereço</strong>
                  {g.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => item.onSelect?.()}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 8,
                        padding: '6px 8px',
                        borderRadius: 8,
                        border: '1px solid var(--color-border-default)',
                        background: 'var(--color-surface)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        font: 'inherit',
                      }}
                    >
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 160,
                        }}
                      >
                        {item.title}
                      </span>
                      {item.priceLabel && (
                        <strong style={{ color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                          {item.priceLabel}
                        </strong>
                      )}
                    </button>
                  ))}
                </div>
              </Popup>
            )}
          </Marker>
        )
      })}

      <FitBounds groups={groups} userCoords={userCoords} />
    </MapContainer>
  )
}
