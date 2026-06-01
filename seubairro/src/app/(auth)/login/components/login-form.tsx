'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { RoleHelper } from '@/lib/api/helper/RoleHelper'
import { LoginSchema, type LoginInput } from '@/features/auth/schemas'
import { Input } from '@/design-system/primitives/Input'
import { Button } from '@/design-system/primitives/Button'
import SplitText from '@/design-system/effects/SplitText'

export default function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuthContext()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const rememberId = useId()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit(async (data) => {
    setServerError('')
    const result = await login(data)
    if (result.success) {
      const redirect = searchParams.get('redirect')
      router.push(redirect || RoleHelper.getRedirectPath())
    } else {
      setServerError(result.message)
    }
  })

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 p-6">
      <header className="flex flex-col items-center gap-3">
        <Image src="/assets/logo-seubairro.svg" alt="Logo SeuBairro" width={56} height={56} priority />
        <SplitText
          text="SeuBairro"
          className="text-2xl font-bold text-[var(--color-title)]"
          delay={50}
          duration={1.25}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
        />
      </header>

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          placeholder="Digite seu email"
          autoComplete="email"
          leftIcon={<i className="ri-mail-line" aria-hidden />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="Digite sua senha"
          autoComplete="current-password"
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

        <div className="flex items-center justify-between text-sm">
          <label htmlFor={rememberId} className="inline-flex items-center gap-2 text-[var(--color-body)] min-h-11">
            <input
              id={rememberId}
              type="checkbox"
              className="size-4 accent-[var(--color-primary)]"
            />
            Lembrar senha
          </label>
          <Link
            href="/recuperar-senha"
            className="text-[var(--color-primary)] hover:underline font-medium"
          >
            Esqueci minha senha
          </Link>
        </div>

        {serverError && (
          <p role="alert" className="text-sm text-center text-[var(--color-danger)]">
            {serverError}
          </p>
        )}

        <Button type="submit" fullWidth isLoading={isSubmitting}>
          Entrar
        </Button>

        <p className="text-sm text-center text-[var(--color-muted)]">
          Não tem uma conta?{' '}
          <Link
            href="/cadastro"
            className="text-[var(--color-primary)] hover:underline font-medium"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  )
}
