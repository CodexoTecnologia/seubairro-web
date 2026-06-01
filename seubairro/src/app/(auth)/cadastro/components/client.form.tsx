'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserService } from '@/lib/api/services/UserService'
import { authService } from '@/lib/api/services/(Auth)/AuthInstance'
import type { CreateCustomerRequest } from '@/lib/api/dtos/Request/client/CreateCustomerRequest'
import { ClientSignupSchema, type ClientSignupInput } from '@/features/auth/schemas'
import { Input } from '@/design-system/primitives/Input'
import { Button } from '@/design-system/primitives/Button'

export const ClientForm: React.FC = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientSignupInput>({
    resolver: zodResolver(ClientSignupSchema),
    defaultValues: { fullName: '', email: '', birthDate: '', password: '' },
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError('')
    const nameParts = data.fullName.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || null
    // Backend espera DateOnly (YYYY-MM-DD). O <input type="date"> já produz esse formato.

    const request: CreateCustomerRequest = {
      firstName: firstName || null,
      lastName,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
      taxId: null,
    }

    try {
      await UserService.registerCustomer(request)
      await authService.login({ email: data.email, password: data.password })
      router.push('/choose-profile')
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Erro ao criar conta. Verifique os dados.',
      )
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full" noValidate>
      <Input
        label="Nome Completo"
        placeholder="Seu nome completo"
        autoComplete="name"
        leftIcon={<i className="ri-user-line" aria-hidden />}
        error={errors.fullName?.message}
        {...register('fullName')}
      />
      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        autoComplete="email"
        leftIcon={<i className="ri-mail-line" aria-hidden />}
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="Data de Nascimento"
        type="date"
        leftIcon={<i className="ri-calendar-line" aria-hidden />}
        error={errors.birthDate?.message}
        {...register('birthDate')}
      />
      <Input
        label="Senha"
        type={showPassword ? 'text' : 'password'}
        placeholder="Crie uma senha forte"
        autoComplete="new-password"
        leftIcon={<i className="ri-lock-line" aria-hidden />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="size-8 flex items-center justify-center rounded-md text-[var(--color-muted)] hover:text-[var(--color-body)] hover:bg-[var(--color-page)] transition-colors"
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <i className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'} aria-hidden />
          </button>
        }
        error={errors.password?.message}
        {...register('password')}
      />

      {serverError && (
        <p role="alert" className="text-sm text-center text-[var(--color-danger)]">
          {serverError}
        </p>
      )}

      <Button type="submit" fullWidth isLoading={isSubmitting}>
        Criar Conta Grátis
      </Button>
    </form>
  )
}
