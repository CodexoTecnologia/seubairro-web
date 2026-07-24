'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

export type Coords = { lat: number; lng: number }
export type LocationSource = 'gps' | 'profile' | null
export type LocationStatus = 'idle' | 'pending' | 'granted' | 'denied' | 'unavailable'

type LocationContextValue = {
  coords: Coords | null
  source: LocationSource
  status: LocationStatus
  /** Dispara o GPS do navegador (timeout 10s) e atualiza o estado conforme o resultado. */
  requestGps: () => void
  /** Força a fonte `profile` com coords vindas do endereço salvo. */
  setProfileCoords: (coords: Coords) => void
  /** Reseta para o estado inicial. */
  clear: () => void
}

const LocationContext = createContext<LocationContextValue | null>(null)

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [source, setSource] = useState<LocationSource>(null)
  const [status, setStatus] = useState<LocationStatus>('idle')

  const requestGps = useCallback(() => {
    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setStatus('unavailable')
      return
    }
    setStatus('pending')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setSource('gps')
        setStatus('granted')
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable')
      },
      { timeout: 10000, maximumAge: 300000, enableHighAccuracy: false },
    )
  }, [])

  const setProfileCoords = useCallback((next: Coords) => {
    setCoords(next)
    setSource('profile')
    setStatus('granted')
  }, [])

  const clear = useCallback(() => {
    setCoords(null)
    setSource(null)
    setStatus('idle')
  }, [])

  const value = useMemo<LocationContextValue>(
    () => ({ coords, source, status, requestGps, setProfileCoords, clear }),
    [coords, source, status, requestGps, setProfileCoords, clear],
  )

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>
}

export function useLocationContext() {
  const ctx = useContext(LocationContext)
  if (!ctx) {
    throw new Error('useLocationContext deve estar dentro de LocationProvider')
  }
  return ctx
}
