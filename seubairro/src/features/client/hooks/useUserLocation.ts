'use client'

import { useCallback, useEffect, useState } from 'react'
import { useLocationContext } from '../context/LocationContext'
import { CustomerProfileService } from '@/lib/api/services/CustomerProfileService'
import { GeocodingService } from '@/lib/api/services/GeocodingService'
import type { PrimaryAddressInfo } from '@/lib/api/dtos/Response/index'

/**
 * Orquestra a descoberta da coordenada do cliente: GPS primeiro, endereço salvo como
 * fallback. Escreve no LocationContext (fonte única) e conhece o endereço de fallback
 * a partir de `GET /api/user/profile` → `primaryAddress` (não há GET dedicado de endereço).
 *
 * Como o backend devolve o endereço sem `latitude/longitude` (e o `UpdateAddressRequest`
 * nem aceita coords), quando faltam coordenadas geocodificamos o endereço no cliente
 * (Nominatim/OSM) e usamos o resultado só em memória, na sessão.
 */
export function useUserLocation() {
  const { coords, source, status, requestGps, setProfileCoords } = useLocationContext()
  const [profileAddress, setProfileAddress] = useState<PrimaryAddressInfo | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    CustomerProfileService.getMe()
      .then((profile) => {
        if (!cancelled) setProfileAddress(profile.primaryAddress)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Erro ao carregar endereço'))
      })
      .finally(() => {
        if (!cancelled) setIsProfileLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const addressHasCoords =
    !!profileAddress && profileAddress.latitude != null && profileAddress.longitude != null
  const addressGeocodable =
    !!profileAddress &&
    GeocodingService.canGeocode({
      city: profileAddress.city,
      stateProvince: profileAddress.stateProvince,
    })
  // Utilizável como fonte de localização se já tem coords ou se dá para geocodificar.
  const hasProfileAddress = addressHasCoords || addressGeocodable

  const applyProfileFallback = useCallback(async () => {
    if (!profileAddress) return
    setError(null)

    if (profileAddress.latitude != null && profileAddress.longitude != null) {
      setProfileCoords({ lat: profileAddress.latitude, lng: profileAddress.longitude })
      return
    }

    // Sem coords no backend → geocodifica o endereço no cliente.
    setIsLocating(true)
    try {
      const point = await GeocodingService.geocodeAddress({
        street: profileAddress.street,
        number: profileAddress.number,
        neighborhood: profileAddress.neighborhood,
        city: profileAddress.city,
        stateProvince: profileAddress.stateProvince,
      })
      if (point) {
        setProfileCoords(point)
      } else {
        setError(new Error('Não conseguimos localizar as coordenadas do seu endereço.'))
      }
    } catch {
      setError(new Error('Falha ao localizar seu endereço. Tente novamente.'))
    } finally {
      setIsLocating(false)
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
    isLocating,
    isProfileLoading,
    error,
  }
}
