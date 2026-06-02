'use client'

import PasswordRecoveryForm from './components/password-recovery-form'
import AuthVisualPanel from '@/features/auth/components/AuthVisualPanel'

export default function RecuperarSenhaPage() {
  return (
    <main className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center bg-[var(--color-page)] p-6">
        <PasswordRecoveryForm />
      </div>
      <AuthVisualPanel
        title="Segurança em primeiro lugar."
        description="Recupere seu acesso de forma simples e rápida."
        mode="recovery"
      />
    </main>
  )
}
