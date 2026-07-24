'use client'

import { useCallback, useEffect, useState } from 'react'
import { CustomerProfileService } from '@/lib/api/services/CustomerProfileService'
import type { CustomerProfileResponse } from '@/lib/api/dtos/Response/index'
import type { UpdateCustomerProfileRequest } from '@/lib/api/dtos/Request/index'
import type { CustomerProfileFormValues } from '../schemas/customer-profile.schema'

import { useAuthContext } from '@/features/auth/context/AuthContext'

export function useCustomerProfile() {
  const { refreshUser } = useAuthContext()
  const [profile, setProfile] = useState<CustomerProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    CustomerProfileService.getMe()
      .then((data) => {
        if (!cancelled) setProfile(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Erro ao carregar perfil'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const updateProfile = useCallback(async (values: CustomerProfileFormValues) => {
    const payload: UpdateCustomerProfileRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneCountryCode: values.phoneCountryCode ? values.phoneCountryCode : null,
      phoneNumber: values.phoneNumber ? values.phoneNumber : null,
    }
    const updated = await CustomerProfileService.updateMe(payload)
    setProfile(updated)
    await refreshUser()
    return updated
  }, [refreshUser])

  const uploadAvatar = useCallback(async (file: File) => {
    const result = await CustomerProfileService.uploadAvatar(file)
    setProfile((prev) => (prev ? { ...prev, profilePictureUrl: result.profilePictureUrl } : prev))
    await refreshUser()
    return result
  }, [refreshUser])

  return { profile, isLoading, error, updateProfile, uploadAvatar }
}
