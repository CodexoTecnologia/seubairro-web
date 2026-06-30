'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocationContext } from '../context/LocationContext'
import { CustomerProfileService } from '@/lib/api/services/CustomerProfileService'
import type { PrimaryAddressInfo } from '@/lib/api/dtos/Response/index'

/**
 * Orquestra a descoberta da coordenada do cliente: GPS primeiro, endereço salvo como
 * fallback. Escreve no LocationContext (fonte única) e conhece o endereço de fallback
 * a partir de `GET /api/user/profile` → `primaryAddress` (não há GET dedicado de endereço).
 */
export function useUserLocation() {
  const { coords, source, status, requestGps, setProfileCoords } = useLocationContext()
  const [profileAddress, setProfileAddress] = useState<PrimaryAddressInfo | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    let cancelled = false
    CustomerProfileService.getMe()
      .then((profile) => {
        if (!cancelled) setProfileAddress(profile.primaryAddress)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Erro ao carregar endereço'))
      })
    return () => {
      cancelled = true
    }
  }, [])

  const hasProfileAddress =
    !!profileAddress && profileAddress.latitude != null && profileAddress.longitude != null

  const applyProfileFallback = useCallback(() => {
    if (profileAddress && profileAddress.latitude != null && profileAddress.longitude != null) {
      setProfileCoords({ lat: profileAddress.latitude, lng: profileAddress.longitude })
    }
  }, [profileAddress, setProfileCoords])

  return {
    coords,
    source,
    status,
    requestGps,
    applyProfileFallback,
    hasProfileAddress,
    profileAddress,
    error,
  }
}
