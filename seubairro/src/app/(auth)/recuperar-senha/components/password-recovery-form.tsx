'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/design-system/primitives/Input'
import { Button } from '@/design-system/primitives/Button'

const RecoverySchema = z.object({
  email: z.string().min(1, 'Informe seu email').email('Email inválido'),
})
type RecoveryInput = z.infer<typeof RecoverySchema>

export default function PasswordRecoveryForm() {
  // Capturamos o email no submit em vez de assinar via watch() — evita o aviso
  // de compatibilidade com React Compiler.
  const [submittedEmail, setSubmittedEmail] = useState('')
  const isSuccess = submittedEmail !== ''
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RecoveryInput>({
    resolver: zodResolver(RecoverySchema),
    defaultValues: { email: '' },
  })

  const onSubmit = handleSubmit(async (data) => {
    await new Promise((r) => setTimeout(r, 1200))
    setSubmittedEmail(data.email)
  })

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6 p-6">
      <header className="flex flex-col items-center text-center gap-2">
        <Link href="/" className="text-2xl font-bold text-[var(--color-title)]">
          Seu<span className="text-[var(--color-primary)]">Bairro</span>
        </Link>
        {!isSuccess ? (
          <>
            <h1 className="text-xl font-bold text-[var(--color-title)] mt-4">Esqueceu a senha?</h1>
            <p className="text-sm text-[var(--color-muted)]">
              Não se preocupe. Digite seu e-mail abaixo para recuperar o acesso.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-[var(--color-title)] mt-4">E-mail enviado!</h1>
            <p className="text-sm text-[var(--color-muted)]">
              Verifique sua caixa de entrada (e spam) para redefinir sua senha.
            </p>
          </>
        )}
      </header>

      {!isSuccess ? (
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="E-mail cadastrado"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            leftIcon={<i className="ri-mail-lock-line" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Button type="submit" fullWidth isLoading={isSubmitting}>
            Enviar Link de Recuperação
          </Button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-4 p-6 rounded-[var(--radius-card)] bg-[var(--color-success-bg)] text-center">
          <div className="size-12 flex items-center justify-center rounded-full bg-[var(--color-success)] text-white text-2xl">
            <i className="ri-mail-send-line" />
          </div>
          <p className="text-sm text-[var(--color-body)]">
            Enviamos um link para <strong>{submittedEmail}</strong>
          </p>
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              setSubmittedEmail('')
              reset()
            }}
          >
            Tentar outro e-mail
          </Button>
        </div>
      )}

      <p className="text-sm text-center text-[var(--color-muted)]">
        Lembrou a senha?{' '}
        <Link href="/login" className="text-[var(--color-primary)] hover:underline font-medium">
          <i className="ri-arrow-left-line align-middle" /> Voltar para Login
        </Link>
      </p>
    </div>
  )
}
