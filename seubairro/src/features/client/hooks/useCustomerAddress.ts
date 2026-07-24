'use client'

import { useCallback, useEffect, useState } from 'react'
import { CustomerProfileService } from '@/lib/api/services/CustomerProfileService'
import { CountryCodeEnum } from '@/lib/api/enums/CountryCodeEnum'
import { useLocationContext } from '../context/LocationContext'
import type { PrimaryAddressInfo } from '@/lib/api/dtos/Response/index'
import type { UpdateAddressRequest } from '@/lib/api/dtos/Request/index'
import type { CustomerAddressFormValues } from '../schemas/customer-address.schema'

export function useCustomerAddress() {
  const { setProfileCoords } = useLocationContext()
  const [address, setAddress] = useState<PrimaryAddressInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    CustomerProfileService.getMe()
      .then((profile) => {
        if (!cancelled) setAddress(profile.primaryAddress)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Erro ao carregar endereço'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const save = useCallback(async (values: CustomerAddressFormValues) => {
    const payload: UpdateAddressRequest = {
      street: values.street,
      number: values.number || null,
      complement: values.complement || null,
      neighborhood: values.neighborhood,
      city: values.city,
      stateProvince: values.stateProvince.toUpperCase(),
      postalCode: values.postalCode,
      countryCode: CountryCodeEnum.Brasil,
    }
    const updated = await CustomerProfileService.updateAddress(payload)
    setAddress(updated)
    // Propaga a coordenada geocodificada para a fonte de localização ativa.
    if (updated.latitude != null && updated.longitude != null) {
      setProfileCoords({ lat: updated.latitude, lng: updated.longitude })
    }
    return updated
  }, [setProfileCoords])

  return { address, isLoading, error, save }
}
