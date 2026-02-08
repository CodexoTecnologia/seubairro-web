'use client'
import React from 'react'
import PasswordRecoveryForm from './components/password-recovery-form'
import AuthVisualPanel from '@/components/auth/auth-visual-panel'
import '@/styles/auth/recuperar-senha/recuperar-senha.css'
export default function RecuperarSenhaPage() {
    return (
        <main className="login-container">
            <div className="login-form-side">
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
