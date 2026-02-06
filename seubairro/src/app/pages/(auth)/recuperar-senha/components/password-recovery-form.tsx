'use client'
import React, { useState, FormEvent } from 'react'
import Link from 'next/link'
import '@/styles/auth/recuperar-senha/password-recovery-forms.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
export default function PasswordRecoveryForm() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setIsSuccess(true)
        }, 1500)
    }
    const handleResend = () => {
        setIsSuccess(false)
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            setIsSuccess(true)
        }, 1500)
    }
    return (
        <div className="form-wrapper">
            <div className="auth-header">
                <Link href="/" className="logo-link">
                    <span className="logo-text">Seu<span>Bairro</span></span>
                </Link>
                {!isSuccess ? (
                    <div>
                        <h1>Esqueceu a senha?</h1>
                        <p>Não se preocupe. Digite seu e-mail abaixo para recuperar o acesso.</p>
                    </div>
                ) : (
                    <div>
                        <h1>E-mail enviado!</h1>
                        <p>Verifique sua caixa de entrada (e spam) para redefinir sua senha.</p>
                    </div>
                )}
            </div>
            {!isSuccess ? (
                <form onSubmit={handleSubmit}>
                    <Input
                        id="email"
                        label="E-mail cadastrado"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<i className="ri-mail-lock-line"></i>}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        isLoading={isLoading}
                        className="btn-submit"
                    >
                        Enviar Link de Recuperação
                    </Button>
                </form>
            ) : (
                <div className="success-box">
                    <div className="success-icon">
                        <i className="ri-mail-send-line"></i>
                    </div>
                    <p>Enviamos um link para <strong>{email}</strong></p>
                    <Button
                        variant="outline"
                        onClick={() => setIsSuccess(false)}
                        fullWidth
                        style={{ marginTop: '1rem' }}
                    >
                        Tentar outro e-mail
                    </Button>
                </div>
            )}
            <div className="auth-footer">
                <p>Lembrou a senha? <Link href="/" className="back-link"><i className="ri-arrow-left-line"></i> Voltar para Login</Link></p>
            </div>
        </div>
    )
}

